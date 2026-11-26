import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Farm, FarmStatus, FarmTrustLevel } from './entities/farm.entity';
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { QueryFarmDto } from './dto/query-farm.dto';
import { FarmImageType } from './entities/farm-image.entity';
import { Product } from 'src/products/entities/product.entity';
import { Batch } from 'src/batch/entities/batch.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderDetail } from 'src/order/entities/order-detail.entity';
import { Review } from 'src/products/entities/review.entity';
@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepo: Repository<Farm>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }
  async findAll(query: QueryFarmDto = {}) {
    const {
      seller_id,
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

    const qb = this.farmRepo
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.images', 'images')
      .leftJoinAndSelect('farm.seller', 'seller');

    if (status) {
      qb.andWhere('farm.status = :status', { status });
    } else {
      qb.andWhere('farm.status = :status', {
        status: FarmStatus.APPROVED,
      });
    }

    // Lọc theo seller nếu có
    if (seller_id !== undefined) {
      qb.andWhere('farm.seller_id = :sellerId', {
        sellerId: seller_id,
      });
    }

    // Tìm kiếm
    if (search) {
      qb.andWhere(
        '(farm.farm_name LIKE :search OR farm.address LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    qb.orderBy('farm.created_at', 'DESC');

    const [farms, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = farms.map((farm) => {
      const firstImage = (farm.images ?? [])
        .filter((img) => img.image_type === 'Farm')
        .sort((a, b) => a.id - b.id)[0];

      return {
        id: farm.id,
        farm_name: farm.farm_name,
        address: farm.address,
        description: farm.description,
        image: firstImage?.image_url ?? null,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const farm = await this.farmRepo
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.images', 'images')
      .leftJoinAndSelect('farm.products', 'products')
      .where('farm.id = :id', { id })
      .getOne();

    if (!farm) {
      throw new NotFoundException(`Không tìm thấy nông trại với id ${id}`);
    }

    const sorted = [...(farm.images ?? [])].sort((a, b) => a.id - b.id);

    return {
      id: farm.id,
      farmName: farm.farm_name,
      ownerName: farm.owner_name,
      address: farm.address,
      description: farm.description,
      areaHa: farm.area_ha != null ? Number(farm.area_ha) : undefined,
      farmingMethod: farm.farming_method,
      trustLevel: farm.trust_level,
      status: farm.status,
      createdAt: farm.created_at,
      images: sorted.map((img) => img.image_url),
      //admin phân biệt loại ảnh
      farmImages: sorted
        .filter((img) => img.image_type === FarmImageType.FARM)
        .map((img) => img.image_url),
      certificates: sorted
        .filter((img) => img.image_type === FarmImageType.CERTIFICATE)
        .map((img) => img.image_url),
      totalProducts: farm.products?.length ?? 0,
    };
  }
  async create(dto: CreateFarmDto): Promise<Farm> {
    const seller = await this.findSellerEntity(dto.seller_id);

    const farm = this.farmRepo.create({
      ...dto,
      seller,
      owner_name: seller.full_name,
      status: FarmStatus.PENDING,
    });

    return this.farmRepo.save(farm);
  }

  async findAllAdmin(query: QueryFarmDto = {}) {
    const {
      seller_id,
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

    const qb = this.farmRepo
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.images', 'images')
      .leftJoinAndSelect('farm.seller', 'seller');

    // Admin mặc định xem tất cả trạng thái.
    // Chỉ lọc trạng thái khi admin truyền status.
    if (status) {
      qb.andWhere('farm.status = :status', { status });
    }

    if (seller_id !== undefined) {
      qb.andWhere('farm.seller_id = :sellerId', {
        sellerId: seller_id,
      });
    }

    if (search?.trim()) {
      qb.andWhere(
        '(farm.farm_name LIKE :search OR farm.address LIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    qb.orderBy('farm.created_at', 'DESC');

    const [farms, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = farms.map((farm) => {
      const firstImage = (farm.images ?? [])
        .filter((img) => img.image_type === 'Farm')
        .sort((a, b) => a.id - b.id)[0];

      return {
        id: farm.id,
        farm_name: farm.farm_name,
        address: farm.address,
        description: farm.description,
        status: farm.status,
        image: firstImage?.image_url ?? null,
        seller_id: farm.seller?.id ?? null,
        area_ha: farm.area_ha != null ? Number(farm.area_ha) : null,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findAllBySeller(sellerId: number, query: QueryFarmDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
    } = query;

    const qb = this.farmRepo
      .createQueryBuilder('farm')
      .leftJoinAndSelect('farm.images', 'images')
      .leftJoinAndSelect('farm.seller', 'seller')
      .where('farm.seller_id = :sellerId', { sellerId });
    if (status) {
      qb.andWhere('farm.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(farm.farm_name LIKE :search OR farm.address LIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('farm.created_at', 'DESC');

    const [farms, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = farms.map((farm) => {
      const firstImage = (farm.images ?? [])
        .filter((img) => img.image_type === 'Farm')
        .sort((a, b) => a.id - b.id)[0];

      return {
        id: farm.id,
        farm_name: farm.farm_name,
        address: farm.address,
        description: farm.description,
        status: farm.status,
        image: firstImage?.image_url ?? null,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findOneBySeller(id: number, sellerId: number): Promise<Farm> {
    const farm = await this.findFarmEntity(id, {
      relations: { images: true },
    });
    this.ensureFarmOwnership(farm, sellerId);
    return farm;
  }

  async updateBySeller(
    id: number,
    sellerId: number,
    dto: UpdateFarmDto,
  ): Promise<Farm> {
    const farm = await this.findOneBySeller(id, sellerId);
    Object.assign(farm, dto);
    farm.status = FarmStatus.PENDING;
    return this.farmRepo.save(farm);
  }


  async removeBySeller(id: number, sellerId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1. Tìm nông trại và khóa bản ghi trong transaction.
      const farm = await manager.findOne(Farm, {
        where: { id },
        relations: { seller: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!farm) {
        throw new NotFoundException('Không tìm thấy Farm');
      }

      this.ensureFarmOwnership(farm, sellerId);

      // 2. Lấy danh sách sản phẩm thuộc nông trại.
      const products = await manager.find(Product, {
        where: { farm: { id: farm.id } },
        select: { id: true },
      });

      const productIds = products.map((product) => product.id);

      if (productIds.length > 0) {
        // 3. Tìm các chi tiết đơn hàng có chứa lô hàng
        // thuộc những sản phẩm của nông trại.
        const affectedDetails = await manager
          .createQueryBuilder(OrderDetail, 'detail')
          .innerJoin('detail.batch', 'batch')
          .innerJoin('batch.product', 'product')
          .select('detail.id', 'detailId')
          .addSelect('detail.order_id', 'orderId')
          .where('product.id IN (:...productIds)', { productIds })
          .getRawMany<{ detailId: number; orderId: number }>();

        const detailIds = affectedDetails.map(
          (detail) => Number(detail.detailId),
        );

        const affectedOrderIds = [
          ...new Set(
            affectedDetails.map((detail) => Number(detail.orderId)),
          ),
        ];

        // 4. Chỉ xóa chi tiết đơn hàng thuộc nông trại này.
        if (detailIds.length > 0) {
          await manager.delete(OrderDetail, {
            id: In(detailIds),
          });
        }

        // 5. Kiểm tra và cập nhật các đơn hàng bị ảnh hưởng.
        for (const orderId of affectedOrderIds) {
          const remainingDetails = await manager.find(OrderDetail, {
            where: { order: { id: orderId } },
          });

          // Không còn sản phẩm nào: xóa đơn hàng.
          if (remainingDetails.length === 0) {
            await manager.delete(Order, { id: orderId });
            continue;
          }

          // Vẫn còn sản phẩm: tính lại tổng tiền.
          const newTotal = remainingDetails.reduce(
            (sum, detail) =>
              sum + Number(detail.price) * Number(detail.quantity),
            0,
          );

          await manager.update(
            Order,
            { id: orderId },
            { total_price: newTotal },
          );
        }

        // 6. Xóa các lô hàng thuộc những sản phẩm này.
        await manager
          .createQueryBuilder()
          .delete()
          .from(Batch)
          .where('product_id IN (:...productIds)', { productIds })
          .execute();

        // 7. Xóa các đánh giá thuộc sản phẩm của nông trại.
        await manager
          .createQueryBuilder()
          .delete()
          .from(Review)
          .where('product_id IN (:...productIds)', { productIds })
          .execute();

        // 8. Xóa sản phẩm.
        await manager.delete(Product, {
          id: In(productIds),
        });
      }
      // 9. Cuối cùng xóa nông trại.
      await manager.remove(Farm, farm);
    });
  }


  async approve(
    id: number,
    trustLevel: FarmTrustLevel,
  ): Promise<Farm> {
    const farm = await this.findFarmEntity(id);

    farm.trust_level = trustLevel;
    farm.status = FarmStatus.APPROVED;

    return this.farmRepo.save(farm);
  }

  async reject(id: number, note?: string): Promise<Farm> {
    // Nếu bạn có cột lưu note từ chối, có thể xử lý gắn vào đây
    return this.setStatus(id, FarmStatus.REJECTED);
  }

  // =========================
  // PRIVATE HELPERS
  // =========================

  private async findFarmEntity(
    id: number,
    options?: { relations?: FindOptionsRelations<Farm> },
  ): Promise<Farm> {
    const farm = await this.farmRepo.findOne({
      where: { id },
      relations: {
        seller: true,
        ...options?.relations,
      }
    });

    if (!farm) {
      throw new NotFoundException('Không tìm thấy Farm');
    }
    return farm;
  }

  private ensureFarmOwnership(farm: Farm, sellerId: number,): void {
    if (farm.seller?.id !== sellerId) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập Farm này',
      );
    }
  }

  private async findSellerEntity(sellerId: number): Promise<User> {
    const seller = await this.userRepository.findOne({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Không tìm thấy Seller');
    }
    if (seller.role !== UserRole.SELLER) {
      throw new ConflictException('User này không phải Seller');
    }
    return seller;
  }

  private async setStatus(id: number, status: FarmStatus): Promise<Farm> {
    const farm = await this.findFarmEntity(id);
    farm.status = status;
    return this.farmRepo.save(farm);
  }
}

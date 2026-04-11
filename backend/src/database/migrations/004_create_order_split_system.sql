-- 订单拆分功能数据库迁移脚本
-- 执行时间: 2026-04-03
-- 功能说明: 为采购订单表添加拆分相关字段，创建拆分记录表

USE mfp_feedback;

-- 1. 为PURCHASE_ORDER表添加拆分相关字段
ALTER TABLE PURCHASE_ORDER 
ADD COLUMN parent_order_id INT NULL COMMENT '父订单ID，用于标识拆分后的子订单' AFTER supplier_id;

ALTER TABLE PURCHASE_ORDER 
ADD COLUMN order_type VARCHAR(20) NOT NULL DEFAULT 'ORIGINAL' COMMENT '订单类型：ORIGINAL-原始订单, SPLIT-子订单' AFTER parent_order_id;

ALTER TABLE PURCHASE_ORDER 
ADD COLUMN split_count INT NULL COMMENT '拆分数量，记录原始订单被拆分为多少个子订单' AFTER order_type;

ALTER TABLE PURCHASE_ORDER 
ADD COLUMN split_batch_no VARCHAR(50) NULL COMMENT '拆分批次号，同一批次拆分的子订单共享此编号' AFTER split_count;

ALTER TABLE PURCHASE_ORDER 
ADD COLUMN split_time DATETIME NULL COMMENT '拆分时间' AFTER split_batch_no;

ALTER TABLE PURCHASE_ORDER 
ADD COLUMN split_operator VARCHAR(50) NULL COMMENT '拆分操作人' AFTER split_time;

-- 2. 创建订单拆分记录表
CREATE TABLE IF NOT EXISTS order_split_record (
  id INT PRIMARY KEY AUTO_INCREMENT,
  original_order_id INT NOT NULL COMMENT '原订单ID',
  original_djbh VARCHAR(50) NOT NULL COMMENT '原订单编号',
  split_batch_no VARCHAR(50) NOT NULL COMMENT '拆分批次号',
  split_count INT NOT NULL COMMENT '拆分数量',
  split_type VARCHAR(20) NOT NULL COMMENT '拆分类型：BY_ITEM-按商品, BY_AMOUNT-按金额',
  split_reason TEXT COMMENT '拆分原因',
  operator VARCHAR(50) NOT NULL COMMENT '操作人',
  status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态：ACTIVE-有效, CANCELLED-已撤销',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_original_order (original_order_id),
  INDEX idx_split_batch (split_batch_no),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单拆分记录表';

-- 3. 创建订单拆分明细表
CREATE TABLE IF NOT EXISTS order_split_detail (
  id INT PRIMARY KEY AUTO_INCREMENT,
  split_record_id INT NOT NULL COMMENT '拆分记录ID',
  sub_order_id INT NOT NULL COMMENT '子订单ID',
  sub_djbh VARCHAR(50) NOT NULL COMMENT '子订单编号',
  supplier_id INT NOT NULL COMMENT '供应商ID',
  supplier_name VARCHAR(100) COMMENT '供应商名称',
  split_amount DECIMAL(10,2) COMMENT '拆分金额',
  split_remark TEXT COMMENT '拆分备注',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_split_record (split_record_id),
  INDEX idx_sub_order (sub_order_id),
  FOREIGN KEY (split_record_id) REFERENCES order_split_record(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单拆分明细表';

-- 4. 为PURCHASE_ORDER表添加索引
CREATE INDEX idx_parent_order_id ON PURCHASE_ORDER(parent_order_id);
CREATE INDEX idx_order_type ON PURCHASE_ORDER(order_type);
CREATE INDEX idx_split_batch_no ON PURCHASE_ORDER(split_batch_no);

-- 5. 更新现有数据（将所有现有订单标记为原始订单）
UPDATE PURCHASE_ORDER 
SET order_type = 'ORIGINAL' 
WHERE order_type IS NULL OR order_type = '';

-- 迁移完成提示
SELECT '订单拆分功能数据库迁移完成' AS status;

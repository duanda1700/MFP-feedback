<template>
  <div class="order-split-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单拆分配置</span>
          <el-button @click="handleBack" size="small">返回</el-button>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 20px;">
        <el-step title="原订单信息" />
        <el-step title="拆分配置" />
        <el-step title="预览确认" />
      </el-steps>

      <div v-if="activeStep === 0" class="step-content">
        <el-descriptions title="原订单信息" :column="2" border>
          <el-descriptions-item label="订单编号">{{ orderInfo.djbH }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ orderInfo.orderStatus }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ orderInfo.applyUsername }}</el-descriptions-item>
          <el-descriptions-item label="申请部门">{{ orderInfo.applyDept }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ orderInfo.major }}</el-descriptions-item>
          <el-descriptions-item label="项目">{{ orderInfo.project }}</el-descriptions-item>
          <el-descriptions-item label="原供应商">{{ orderInfo.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="台份">{{ orderInfo.setCount }}</el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div class="order-details">
          <h4>订单明细</h4>
          <el-table :data="orderDetails" style="width: 100%" max-height="400">
            <el-table-column prop="materialCode" label="物料编码" width="150" />
            <el-table-column prop="materialDesc" label="物料描述" />
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column prop="planDate" label="计划日期" width="120" />
          </el-table>
        </div>

        <div class="step-actions">
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </div>

      <div v-if="activeStep === 1" class="step-content">
        <el-alert title="拆分规则说明" type="info" :closable="false" style="margin-bottom: 20px;">
          <template #default>
            <p><strong>操作步骤：</strong></p>
            <p>1. 点击"添加供应商"按钮，添加至少一个供应商</p>
            <p>2. 为每个供应商选择供应商并填写名称</p>
            <p>3. 为每个供应商分配明细条目和数量（可使用"批量添加条目"或"同步原始条目"）</p>
            <p>4. 确保所有明细条目的分配数量总和等于原始数量</p>
            <p><strong>验证要求：</strong></p>
            <p>• 至少添加一个供应商</p>
            <p>• 每个供应商必须选择并填写名称</p>
            <p>• 每个供应商至少分配一个条目</p>
            <p>• 所有条目的分配数量必须完整（不能多也不能少）</p>
          </template>
        </el-alert>

        <el-form :model="splitForm" label-width="120px">
          <el-form-item label="拆分原因">
            <el-input v-model="splitForm.splitReason" type="textarea" :rows="2" placeholder="请输入拆分原因" />
          </el-form-item>

          <el-divider />

          <div class="split-config">
            <div class="config-header">
              <h4>明细条目分配</h4>
              <el-button type="primary" size="small" @click="addSupplier">添加供应商</el-button>
            </div>

            <div class="supplier-tabs">
              <el-tag 
                v-for="(supplier, index) in splitForm.suppliers" 
                :key="index"
                :type="activeSupplierIndex === index ? 'primary' : 'info'"
                @click="activeSupplierIndex = index"
                style="cursor: pointer; margin-right: 10px;"
              >
                {{ supplier.supplierName || `供应商${index + 1}` }}
              </el-tag>
            </div>

            <div v-if="splitForm.suppliers.length > 0" class="supplier-detail">
              <el-card>
                <template #header>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ splitForm.suppliers[activeSupplierIndex]?.supplierName || `供应商${activeSupplierIndex + 1}` }}的分配</span>
                    <el-button 
                      type="danger" 
                      size="small" 
                      @click="removeSupplier(activeSupplierIndex)"
                      v-if="splitForm.suppliers.length > 1"
                    >
                      删除此供应商
                    </el-button>
                  </div>
                </template>

                <el-form label-width="100px">
                  <el-form-item label="供应商">
                    <el-select 
                      v-model="splitForm.suppliers[activeSupplierIndex].supplierId" 
                      placeholder="选择供应商" 
                      style="width: 300px;"
                      @change="updateSupplierName"
                    >
                      <el-option 
                        v-for="supplier in supplierList" 
                        :key="supplier.id" 
                        :label="supplier.supplierName" 
                        :value="supplier.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="供应商名称">
                    <el-input 
                      v-model="splitForm.suppliers[activeSupplierIndex].supplierName" 
                      placeholder="供应商名称" 
                      style="width: 300px;"
                    />
                  </el-form-item>
                </el-form>

                <el-divider content-position="left">明细条目分配</el-divider>

                <div style="margin-bottom: 15px;">
                  <el-button type="primary" size="small" @click="showAddItemsDialog">
                    <el-icon><Plus /></el-icon>
                    批量添加条目
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="batchRemoveItems"
                    :disabled="selectedItems.length === 0"
                  >
                    <el-icon><Delete /></el-icon>
                    批量删除 ({{ selectedItems.length }})
                  </el-button>
                  <el-button size="small" @click="syncFromOriginal">
                    <el-icon><Refresh /></el-icon>
                    同步原始条目
                  </el-button>
                </div>

                <el-table 
                  :data="getSupplierItems()" 
                  style="width: 100%"
                  @selection-change="handleItemSelection"
                  v-loading="loading"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="materialCode" label="物料编码" width="150" />
                  <el-table-column prop="materialDesc" label="物料描述" />
                  <el-table-column prop="originalQuantity" label="原始数量" width="100">
                    <template #default="scope">
                      <el-tag>{{ scope.row.originalQuantity }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="已分配数量" width="120">
                    <template #default="scope">
                      <el-tag :type="getAssignedQuantity(scope.row.materialCode) === scope.row.originalQuantity ? 'success' : 'warning'">
                        {{ getAssignedQuantity(scope.row.materialCode) }} / {{ scope.row.originalQuantity }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="分配数量" width="150">
                    <template #default="scope">
                      <el-input-number 
                        v-model="scope.row.quantity"
                        :min="0" 
                        :max="scope.row.originalQuantity"
                        :precision="0"
                        @change="validateQuantity(scope.row)"
                        style="width: 100%;"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" width="150">
                    <template #default="scope">
                      <el-input 
                        v-model="scope.row.remark"
                        placeholder="备注"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template #default="scope">
                      <el-button 
                        type="danger" 
                        size="small" 
                        @click="removeSingleItem(scope.$index)"
                        :icon="Delete"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>

            <div v-else class="empty-supplier">
              <el-empty description="请添加至少一个供应商" />
            </div>

            <el-divider />

            <div class="allocation-summary">
              <h4>分配汇总</h4>
              <el-table :data="getAllocationSummary()" style="width: 100%">
                <el-table-column prop="materialCode" label="物料编码" width="150" />
                <el-table-column prop="materialDesc" label="物料描述" />
                <el-table-column prop="originalQuantity" label="原始数量" width="100" />
                <el-table-column prop="assignedQuantity" label="已分配数量" width="120">
                  <template #default="scope">
                    <el-tag :type="scope.row.assignedQuantity === scope.row.originalQuantity ? 'success' : 'danger'">
                      {{ scope.row.assignedQuantity }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="剩余未分配" width="120">
                  <template #default="scope">
                    <el-tag :type="scope.row.originalQuantity - scope.row.assignedQuantity === 0 ? 'success' : 'warning'">
                      {{ scope.row.originalQuantity - scope.row.assignedQuantity }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '完成' ? 'success' : 'danger'">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
              
              <el-alert 
                v-if="getAllocationSummary().some(item => item.status === '未完成')"
                type="error"
                :closable="false"
                style="margin-top: 15px;"
              >
                <template #title>
                  <strong>注意：</strong>还有 {{ getAllocationSummary().filter(item => item.status === '未完成').length }} 个条目未完成分配
                </template>
              </el-alert>
            </div>
          </div>
        </el-form>

        <div class="step-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button 
              type="primary" 
              @click="previewSplit" 
              :loading="previewLoading" 
              :disabled="!validateAllocation()"
            >
              预览拆分
            </el-button>
          </div>
          
          <el-alert 
            v-if="!validateAllocation() && splitForm.suppliers.length > 0"
            :title="getValidationMessage()"
            type="warning"
            :closable="false"
            style="margin-top: 15px;"
          />
      </div>

      <div v-if="activeStep === 2" class="step-content">
        <el-alert title="拆分预览" type="info" :closable="false" style="margin-bottom: 20px;">
          <template #default>
            <p>原订单 <strong>{{ orderInfo.djbH }}</strong> 将被拆分为 <strong>{{ previewData.subOrders?.length || 0 }}</strong> 个子订单</p>
          </template>
        </el-alert>

        <el-table :data="previewData.subOrders" style="width: 100%">
          <el-table-column type="expand">
            <template #default="scope">
              <div style="padding: 0 50px;">
                <h4 style="margin: 10px 0;">明细条目</h4>
                <el-table :data="scope.row.items" style="width: 100%">
                  <el-table-column prop="materialCode" label="物料编码" width="150" />
                  <el-table-column prop="materialDesc" label="物料描述" />
                  <el-table-column prop="quantity" label="数量" width="100" />
                  <el-table-column prop="remark" label="备注" width="150" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subDjbh" label="子订单编号" width="200" />
          <el-table-column prop="supplierName" label="供应商" width="200" />
          <el-table-column prop="itemCount" label="条目数量" width="120" />
          <el-table-column prop="totalQuantity" label="总数量" width="120" />
        </el-table>

        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="confirmSplit" :loading="splitLoading">确认拆分</el-button>
        </div>
      </div>
    </el-card>

    <!-- 批量添加条目对话框 -->
    <el-dialog 
      v-model="addItemsDialogVisible" 
      title="批量添加条目" 
      width="70%"
      :close-on-click-modal="false"
    >
      <el-alert title="选择要添加的明细条目" type="info" :closable="false" style="margin-bottom: 15px;">
        <template #default>
          <p>请从总订单明细中选择要分配给当前供应商的条目</p>
        </template>
      </el-alert>

      <el-table 
        :data="availableItemsForAdd" 
        style="width: 100%"
        @selection-change="handleAddItemSelection"
        max-height="400"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="materialCode" label="物料编码" width="150" />
        <el-table-column prop="materialDesc" label="物料描述" />
        <el-table-column prop="quantity" label="总数量" width="100">
          <template #default="scope">
            <el-tag>{{ scope.row.quantity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已分配数量" width="120">
          <template #default="scope">
            <el-tag :type="getAssignedQuantity(scope.row.materialCode) > 0 ? 'success' : 'info'">
              {{ getAssignedQuantity(scope.row.materialCode) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="剩余可分配" width="120">
          <template #default="scope">
            <el-tag :type="getRemainingQuantity(scope.row) > 0 ? 'success' : 'danger'">
              {{ getRemainingQuantity(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addItemsDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="confirmAddItems"
            :disabled="selectedAddItems.length === 0"
          >
            确认添加 ({{ selectedAddItems.length }})
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Delete, Refresh } from '@element-plus/icons-vue';
import { purchaseOrderApi } from '../api';

const router = useRouter();
const route = useRoute();

const activeStep = ref(0);
const previewLoading = ref(false);
const splitLoading = ref(false);
const loading = ref(false);
const activeSupplierIndex = ref(0);
const addItemsDialogVisible = ref(false);
const selectedItems = ref<any[]>([]);
const selectedAddItems = ref<any[]>([]);

const orderInfo = ref<any>({
  id: '',
  djbH: '',
  orderStatus: '',
  applyUsername: '',
  applyDept: '',
  major: '',
  project: '',
  supplierName: '',
  setCount: ''
});

const orderDetails = ref<any[]>([]);

const supplierList = ref<any[]>([]);

const splitForm = reactive({
  splitReason: '',
  suppliers: [] as any[]
});

const previewData = ref<any>({
  originalOrder: {},
  subOrders: []
});

const availableItemsForAdd = computed(() => {
  const currentSupplier = splitForm.suppliers[activeSupplierIndex.value];
  if (!currentSupplier) return [];
  
  const assignedMaterialCodes = currentSupplier.items.map((item: any) => item.materialCode);
  
  return orderDetails.value.filter(detail => {
    const remaining = getRemainingQuantity(detail);
    return remaining > 0 && !assignedMaterialCodes.includes(detail.materialCode);
  }).map(detail => ({
    ...detail,
    remainingQuantity: getRemainingQuantity(detail)
  }));
});

const handleBack = () => {
  router.back();
};

const nextStep = () => {
  activeStep.value++;
};

const prevStep = () => {
  activeStep.value--;
};

const addSupplier = () => {
  const newSupplier = {
    supplierId: '',
    supplierName: '',
    items: []
  };
  splitForm.suppliers.push(newSupplier);
  activeSupplierIndex.value = splitForm.suppliers.length - 1;
};

const removeSupplier = (index: number) => {
  splitForm.suppliers.splice(index, 1);
  if (activeSupplierIndex.value >= splitForm.suppliers.length) {
    activeSupplierIndex.value = splitForm.suppliers.length - 1;
  }
};

const updateSupplierName = () => {
  const supplier = supplierList.value.find(s => s.id === splitForm.suppliers[activeSupplierIndex.value].supplierId);
  if (supplier) {
    splitForm.suppliers[activeSupplierIndex.value].supplierName = supplier.supplierName;
  }
};

const getAssignedQuantity = (materialCode: string): number => {
  let total = 0;
  splitForm.suppliers.forEach(supplier => {
    const item = supplier.items?.find((i: any) => i.materialCode === materialCode);
    if (item) {
      total += item.quantity || 0;
    }
  });
  return total;
};

const validateQuantity = (row: any) => {
  const assigned = getAssignedQuantity(row.materialCode);
  if (assigned > row.originalQuantity) {
    ElMessage.warning(`物料 ${row.materialCode} 的分配数量超过原始数量`);
    row.quantity = row.originalQuantity - (assigned - row.quantity);
  }
};

const validateAllocation = (): boolean => {
  if (splitForm.suppliers.length === 0) {
    return false;
  }

  for (const supplier of splitForm.suppliers) {
    if (!supplier.supplierId || !supplier.supplierName) {
      return false;
    }
    
    if (!supplier.items || supplier.items.length === 0) {
      return false;
    }
  }

  for (const detail of orderDetails.value) {
    const assigned = getAssignedQuantity(detail.materialCode);
    if (assigned !== detail.quantity) {
      return false;
    }
  }

  return true;
};

const getValidationMessage = (): string => {
  if (splitForm.suppliers.length === 0) {
    return '请至少添加一个供应商';
  }

  for (let i = 0; i < splitForm.suppliers.length; i++) {
    const supplier = splitForm.suppliers[i];
    if (!supplier.supplierId || !supplier.supplierName) {
      return `第${i + 1}个供应商信息不完整`;
    }
    
    if (!supplier.items || supplier.items.length === 0) {
      return `第${i + 1}个供应商未分配任何条目`;
    }
  }

  for (const detail of orderDetails.value) {
    const assigned = getAssignedQuantity(detail.materialCode);
    if (assigned !== detail.quantity) {
      return `物料 ${detail.materialCode} 分配数量不完整（已分配 ${assigned}/${detail.quantity}）`;
    }
  }

  return '';
};

const getAllocationSummary = () => {
  return orderDetails.value.map(detail => {
    const assigned = getAssignedQuantity(detail.materialCode);
    return {
      materialCode: detail.materialCode,
      materialDesc: detail.materialDesc,
      originalQuantity: detail.quantity,
      assignedQuantity: assigned,
      status: assigned === detail.quantity ? '完成' : '未完成'
    };
  });
};

const getRemainingQuantity = (detail: any): number => {
  const assigned = getAssignedQuantity(detail.materialCode);
  return detail.quantity - assigned;
};

const showAddItemsDialog = () => {
  addItemsDialogVisible.value = true;
};

const handleAddItemSelection = (selection: any[]) => {
  selectedAddItems.value = selection;
};

const confirmAddItems = () => {
  if (selectedAddItems.value.length === 0) {
    ElMessage.warning('请至少选择一个条目');
    return;
  }

  const currentSupplier = splitForm.suppliers[activeSupplierIndex.value];
  if (!currentSupplier.items) {
    currentSupplier.items = [];
  }

  let addedCount = 0;
  for (const item of selectedAddItems.value) {
    const existingItem = currentSupplier.items.find((i: any) => i.materialCode === item.materialCode);
    if (!existingItem) {
      const remaining = getRemainingQuantity(item);
      if (remaining > 0) {
        currentSupplier.items.push({
          materialCode: item.materialCode,
          materialDesc: item.materialDesc,
          originalQuantity: item.quantity,
          quantity: remaining,
          remark: ''
        });
        addedCount++;
      }
    }
  }

  ElMessage.success(`成功添加 ${addedCount} 个条目`);
  addItemsDialogVisible.value = false;
  selectedAddItems.value = [];
};

const handleItemSelection = (selection: any[]) => {
  selectedItems.value = selection;
};

const batchRemoveItems = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请至少选择一个条目');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedItems.value.length} 个条目吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const currentSupplier = splitForm.suppliers[activeSupplierIndex.value];
    const selectedMaterialCodes = selectedItems.value.map((item: any) => item.materialCode);
    
    currentSupplier.items = currentSupplier.items.filter(
      (item: any) => !selectedMaterialCodes.includes(item.materialCode)
    );

    ElMessage.success(`成功删除 ${selectedItems.value.length} 个条目`);
    selectedItems.value = [];
  } catch (error) {
    // 用户取消
  }
};

const removeSingleItem = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此条目吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const currentSupplier = splitForm.suppliers[activeSupplierIndex.value];
    currentSupplier.items.splice(index, 1);
    ElMessage.success('删除成功');
  } catch (error) {
    // 用户取消
  }
};

const syncFromOriginal = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将同步总订单的所有明细条目到当前供应商，已分配的条目将被跳过。是否继续？',
      '同步确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    );

    const currentSupplier = splitForm.suppliers[activeSupplierIndex.value];
    if (!currentSupplier.items) {
      currentSupplier.items = [];
    }

    let addedCount = 0;
    for (const detail of orderDetails.value) {
      const existingItem = currentSupplier.items.find((i: any) => i.materialCode === detail.materialCode);
      if (!existingItem) {
        const remaining = getRemainingQuantity(detail);
        if (remaining > 0) {
          currentSupplier.items.push({
            materialCode: detail.materialCode,
            materialDesc: detail.materialDesc,
            originalQuantity: detail.quantity,
            quantity: remaining,
            remark: ''
          });
          addedCount++;
        }
      }
    }

    if (addedCount > 0) {
      ElMessage.success(`成功同步 ${addedCount} 个条目`);
    } else {
      ElMessage.info('所有条目已分配完成，无需同步');
    }
  } catch (error) {
    // 用户取消
  }
};

const getSupplierItems = () => {
  if (!splitForm.suppliers[activeSupplierIndex.value]) {
    return [];
  }
  return splitForm.suppliers[activeSupplierIndex.value].items || [];
};

const loadOrderInfo = async () => {
  const orderId = route.params.id;
  try {
    const response = await purchaseOrderApi.getOrderById(Number(orderId));
    orderInfo.value = response.order || response;
    orderDetails.value = response.details || [];
  } catch (error: any) {
    console.error('Load order info error:', error);
    ElMessage.error(error.message || '加载订单信息失败');
  }
};

const loadSupplierList = async () => {
  try {
    const response = await purchaseOrderApi.getSuppliers();
    supplierList.value = response || [];
  } catch (error: any) {
    console.error('Load supplier list error:', error);
    ElMessage.error(error.message || '加载供应商列表失败');
  }
};

const previewSplit = async () => {
  if (!validateAllocation()) {
    ElMessage.warning('请确保所有明细条目都已正确分配');
    return;
  }

  previewLoading.value = true;
  try {
    const orderId = Number(route.params.id);
    
    const suppliers = splitForm.suppliers.map(s => ({
      supplierId: Number(s.supplierId),
      supplierName: s.supplierName,
      items: s.items.filter((item: any) => item.quantity > 0).map((item: any) => ({
        materialCode: item.materialCode,
        materialDesc: item.materialDesc,
        quantity: item.quantity,
        remark: item.remark
      }))
    }));

    const response = await purchaseOrderApi.previewOrderSplit({
      orderId,
      suppliers
    });
    
    previewData.value = response;
    activeStep.value = 2;
  } catch (error: any) {
    console.error('Preview split error:', error);
    ElMessage.error(error.response?.data?.message || error.message || '预览拆分失败');
  } finally {
    previewLoading.value = false;
  }
};

const confirmSplit = async () => {
  try {
    await ElMessageBox.confirm(
      '确认拆分订单？拆分后原订单状态将变为"已拆分"，将生成多个子订单。',
      '确认拆分',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    splitLoading.value = true;
    const orderId = Number(route.params.id);
    
    const suppliers = splitForm.suppliers.map(s => ({
      supplierId: Number(s.supplierId),
      supplierName: s.supplierName,
      items: s.items.filter((item: any) => item.quantity > 0).map((item: any) => ({
        materialCode: item.materialCode,
        materialDesc: item.materialDesc,
        quantity: item.quantity,
        remark: item.remark
      }))
    }));

    await purchaseOrderApi.executeOrderSplit({
      orderId,
      splitReason: splitForm.splitReason,
      suppliers
    });

    ElMessage.success('订单拆分成功');
    router.push('/app/purchase-order');
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Confirm split error:', error);
      ElMessage.error(error.response?.data?.message || error.message || '订单拆分失败');
    }
  } finally {
    splitLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    loadOrderInfo(),
    loadSupplierList()
  ]);
});
</script>

<style scoped>
.order-split-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-content {
  min-height: 400px;
}

.step-actions {
  margin-top: 30px;
  text-align: center;
}

.order-details {
  margin-top: 20px;
}

.split-config {
  margin-top: 20px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.config-header h4 {
  margin: 0;
}

.supplier-tabs {
  margin-bottom: 20px;
}

.supplier-detail {
  margin-top: 20px;
}

.empty-supplier {
  margin-top: 20px;
  text-align: center;
}

.allocation-summary {
  margin-top: 20px;
}

.allocation-summary h4 {
  margin-bottom: 15px;
}
</style>

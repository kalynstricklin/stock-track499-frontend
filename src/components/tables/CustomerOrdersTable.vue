<script setup lang="ts">
import { ref, computed } from 'vue';

const dialog = ref(false);
const dialogEdit= ref(false);

const editedItem = ref({
  PO_number: 0,
  customer_ID: '', //this should be getten by authentication and seeing which user is signed in
  part_number: '',
  qty: 0,
  status: 'Pending'
});

const editedIndex = ref(-1);
const formTitle = ref("New Order");
const buttonTitle = computed(()=>{return editedIndex.value === -1 ? 'Add' : 'Update'})

const headers = [
  { title: 'Order ID', key: 'PO_number' },
  { title: 'Customer', key: 'customer_ID' },
  // { title: 'Product Name', key: 'product_name' },
  { title: 'Part Number', key: 'part_number' },

  { title: 'Order Date', key: 'order_date' },
  { title: 'Delivery Date', key: 'due_date' },
  { title: 'Received Date', key: 'received_date' },

  { title: 'Quantity', key: 'qty' },
  { title: 'Unit Price', key: 'outbound_price' },
  { title: 'Total Cost', key: 'total_cost' },
  { title: 'Status', key: 'status' },
  { title: 'Edit', key: 'edit', sortable: false },
];

const order = ref([
  { PO_number: 6, customer_ID: 'Kalyn', part_number: 43, order_date: '11-25-2023', due_date: '11/27/2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Pending', },
  { PO_number: 5, customer_ID: 'Kalyn', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Pending', },
  { PO_number: 4, customer_ID: 'Jack', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Unfulfilled', },
  { PO_number: 3, customer_ID: 'Alex', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Unfulfilled', },
  { PO_number: 2, customer_ID: 'Alex', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Fulfilled', },
  { PO_number: 1, customer_ID: 'Josh', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Fulfilled', },
  { PO_number: 0, customer_ID: 'Kalyn', part_number: 43, order_date: '11-25-2023', due_date: '11-27-2023', received_date: '11/27/2023', outbound_price: 12, total_cost: 36, qty: 3, status: 'Fulfilled', },
]);


const close = () => {
  dialog.value = false;
  editedItem.value = { PO_number: 0, customer_ID: '', part_number: '', qty: 0, status: 'Pending' };
};

const save = () => {
  if(editedIndex.value === -1){
    const newOrder = {
      PO_number: order.value.length + 1,
      customer_id: editedItem.value.customer_ID,
      part_number: editedItem.value.part_number,
      order_date: new Date().toISOString(),
      delivery_date: new Date().toISOString(),
      due_date: new Date().toISOString(),
      qty: editedItem.value.qty,
      price: 5,
      status: 'Pending',

    }
    order.value.push(newOrder);
  }else{
    order.value[editedIndex.value] = { ...editedItem.value };
  }

  close();
};

const openDialog = () => {
  dialog.value = true;
  formTitle.value = "New Order";
  editedItem.value = { PO_number: 0, customer_ID: '', part_number: '', qty: 0, status: 'Pending' };
};

function editItem(item: any){
  editedIndex.value = order.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogEdit.value= true
}

const saveStatus = () => {
  if(editedIndex.value !== -1){
    order.value[editedIndex.value].status = editedItem.value.status;
  }
  dialogEdit.value = false;
}

// search bar
const search = ref('')

// status color
const getColor = (status: string) =>{
  if(status === 'Unfulfilled') return 'red'
  else if(status === 'Pending') return 'orange'
  else if(status === 'Fulfilled') return 'green'
}


const calculateTotalPrice = (qty: number, price: number) => {
  return qty * price;
};


</script>


<template>
    <v-data-table
      v-model:search="search"
      :headers="headers"
      :items="order"
      item-value="PO_order"
      :filter-keys="['PO_order','customer_ID', 'part_number', 'status', 'order_date', 'due_date', 'received_date', 'total_cost', 'qty', 'outbound_price']"
    >

      <template v-slot:item.status="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.total_cost="{ value }">
          {{'$'+ value }}
      </template>

      <template v-slot:item.outbound_price="{ value }">
        {{'$'+ value }}
      </template>


      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">
            Customer Orders
          </v-card-title>

          <v-spacer></v-spacer>

          <!-- Search Orders -->
          <v-text-field
            v-model="search"
            density="compact"
            label="Search Orders"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>


          <!-- New Order Popup dialog  -->
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark v-bind="props"  @click="openDialog">
                New Order
              </v-btn>

            </template>

            <v-card
              prepend-icon="mdi-cart"
              title="Customer Order"
            >

              <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.customer_ID"
                        label="Customer*"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.part_number"
                        label="Part Number*"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.qty"
                        label="Quantity*"
                        required
                      ></v-text-field>
                    </v-col>

                  </v-row>
                <small class="text-caption text-medium-emphasis">*indicates required field</small>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="Close"
                  variant="plain"
                  @click="dialog=false"
                ></v-btn>

                <v-btn
                  color="primary"
                  variant="tonal"
                  @click="save"
                >{{buttonTitle}}</v-btn>

              </v-card-actions>

            </v-card>
          </v-dialog>


          <v-dialog v-model="dialogEdit" max-width="600px">
            <v-card>
              <v-card-title>
                Edit Status
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="3">
                    <v-text-field
                      v-model="editedItem.PO_number"
                      label="Order ID"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="editedItem.customer_ID"
                      label="Customer"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="editedItem.part_number"
                      label="Part Number"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      v-model="editedItem.status"
                      :items="['Pending', 'Unfulfilled', 'Fulfilled']"
                      label="Status"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancel" @click="dialogEdit = false">Cancel</v-btn>
                <v-btn color="primary" @click="saveStatus">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.edit="{ item }">
          <v-icon
            dark
            elevation="0"
            size="small"
            class="me-2"
            icon
            color="green"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
      </template>

    </v-data-table>

</template>

<style scoped>
</style>



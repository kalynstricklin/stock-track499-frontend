<script setup lang="ts">
import { ref, computed } from 'vue';


const expanded = ref([]);
const dialog = ref(false);
const editedItem = ref({
  name: '',
  items: []
});
const editedIndex = ref(-1);
const formTitle = ref("New Order");

const headers = [
  { title: 'Order ID', key: 'orderId' },
  { title: 'Customer', key: 'customer' },
  { title: 'Date', key: 'orderDate' },
  { title: 'Status', key: 'status' },
  { title: 'Items', key: 'itemCount' },
  { title: '', key: 'data-table-expand' },
];

// replace this with the actual inventory
const inv = ref([
  { productId: 'vh-1233', productName: 'Scarf', onHand: 33 },
  { productId: 'vh-1234', productName: 'Hat', onHand: 25 },
  { productId: 'vh-1235', productName: 'Gloves', onHand: 20 },
  { productId: 'vh-1236', productName: 'Jacket', onHand: 48 },
  { productId: 'vh-1788', productName: 'Socks', onHand: 65 },
  { productId: 'vh-1789', productName: 'Shirt', onHand: 65 },
  { productId: 'vh-1798', productName: 'Shorts', onHand: 65 },
  { productId: 'vh-1758', productName: 'Shoes', onHand: 65 },
]);

const inventory =ref( ['Scarf', 'Hat', 'Gloves', 'Jacket', 'Socks', 'Shirt', 'Shorts', 'Shoes',]);



const order = ref([
  {
    orderId: '1',
    customer: 'Kalyn S',
    orderDate: '11-25-2023',
    status: 'Fulfilled',
    itemCount: 3,
    items: [
      { productName: 'Scarf', price: 12, productId: 'vh-1233', pick: 1, onHand: 33},
      { productName: 'Hat', price: 12, productId: 'vh-1234', pick: 2, onHand: 25},
    ],
  },
  {
    orderId: '2',
    customer: 'Ashley P',
    orderDate: '12-12-2023',
    status: 'Unfulfilled',
    itemCount: 5,
    items: [
      { productName: 'Gloves', price: 12, productId: 'vh-1235', pick: 3, onHand: 20},
      { productName: 'Jacket', price: 12, productId: 'pn-1236', pick: 1, onHand: 48 },
      { productName: 'Pant',price: 12,  productId: 'pn-1236', pick: 1, onHand: 48 },
    ],
  },
  {
    orderId: '3',
    customer: 'Josh Z',
    orderDate: '12-12-2023',
    status: 'Pending',
    itemCount: 5,
    items: [
      { productName: 'Jacket', price: 12, productId: 'pn-1236', pick: 1, onHand: 48 },
      { productName: 'Socks',price: 12,  productId: 'vh-1788', pick: 2, onHand: 65 },
      { productName: 'Shirt', price: 12, productId: 'vh-1788', pick: 2, onHand: 65 },
    ],
  },
  {
    orderId: '4',
    customer: 'Josh Z',
    orderDate: '11-25-2023',
    status: 'Fulfilled',
    itemCount: 4,
    items: [
      { productName: 'Scarf',price: 12,  productId: 'vh-1233', pick: 2, onHand: 33},
      { productName: 'Hat',price: 12,  productId: 'vh-1234', pick: 2, onHand: 25},
    ],
  },
  {
    orderId: '5',
    customer: 'Alex A',
    orderDate: '11-25-2023',
    status: 'Fulfilled',
    itemCount: 3,
    items: [
      { productName: 'Socks',price: 12,  productId: 'vh-1788', pick: 1, onHand: 33},
      { productName: 'Hat', price: 12, productId: 'vh-1234', pick: 2, onHand: 25},
    ],
  },
]);


const close = () => {
  dialog.value = false;
  editedItem.value = {};
};

const save = () => {
  if(editedIndex.value === -1){
    const newOrder = {
      orderId: String(order.value.length + 1),
      customer: editedItem.value.name,
      orderDate: new Date().toLocaleDateString(),
      status: 'Pending',
      itemCount: editedItem.value.items?.length || 0,
      items: getItems(editedItem.value.items)
    };
    order.value.push(newOrder);
  }else{
    order.value[editedIndex.value] = { ...editedItem.value };
  }

  close();
};

const getItems = (productNames: string[]) => {
  return productNames
    .map(productName => inv.value.find(item => item.productName === productName))
    .filter(Boolean);
};


const openDialog = () => {
  dialog.value = true;
  formTitle.value = "New Order";
  editedItem.value = { name: '', items: [] };
};

// search bar
const search = ref('')

// status color
const getColor = (status: string) =>{
  if(status === 'Unfulfilled') return 'red'
  else if(status === 'Pending') return 'orange'
  else if(status === 'Fulfilled') return 'green'
}


const calculateTotalPrice = (items: any) => {
  return items.reduce((total: any, item: any) => total + (item.pick * item.price), 0);
};


</script>


<template>
    <v-data-table
      v-model:expanded="expanded"
      v-model:search="search"
      :headers="headers"
      :items="order"
      item-value="orderId"
      show-expand
      :filter-keys="['customer', 'orderId', 'status', 'orderDate']"
    >
      <template v-slot:item.orderId="{ value }">
        {{ '#' + value }}
      </template>

      <template v-slot:item.status="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>


      <template v-slot:top>
        <v-toolbar flat>
          <v-card-title class="d-flex align-center pe-2">
            Orders
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

            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Customer Name"
                      ></v-text-field>
                    </v-col>

                    <v-select
                      v-model="editedItem.items"
                      :items="inventory"
                      label="Add Items to Order"
                      multiple
                      item-value="title"
                      item-text="title"
                    >
                      <template v-slot:selection="{ item, index }">

                        <span>{{ item.title }}</span>
<!--                        <v-text-field-->
<!--                        type="number"-->
<!--                        label="Qty"-->
<!--                        style="">-->

<!--                        </v-text-field>-->

<!--                        <v-text-field-->
<!--                          v-model="editedItem.items[index].quantity"-->
<!--                          type="number"-->
<!--                          label="Qty"-->
<!--                          hide-details-->
<!--                        >-->

<!--                        </v-text-field>-->

                      </template>
                    </v-select>

                  </v-row>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-data-table
              hide-default-header
              hide-default-footer
              :items="item.items"
              :items-value="item.items"
              :items-per-page="-1"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>
                    <v-list-item-title> {{ item.productName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.productId }}</v-list-item-subtitle>
                  </td>
                  <td>
                    <v-list-item-subtitle>Pick</v-list-item-subtitle>
                    <v-list-item-title> {{ item.pick }}</v-list-item-title>
                  </td>
                  <td>
                    <v-list-item-subtitle>Price</v-list-item-subtitle>
                    <v-list-item-title> $ {{ item.price }}</v-list-item-title>
                  </td>

                  <td>
                    <v-list-item-subtitle>On Hand</v-list-item-subtitle>
                    <v-list-item-title> {{item.onHand}}</v-list-item-title>
                  </td>
                </tr>

              </template>
            </v-data-table>
          </td>
        </tr>

        <tr>
          <td :colspan="columns.length" class="text-right">
            Total Price: ${{ calculateTotalPrice(item.items) }}
          </td>
        </tr>
      </template>
    </v-data-table>

</template>

<style scoped>
</style>
import { ref } from 'vue'
export const showSnackbar =(message: string, type: 'success'| 'error'| 'info' = 'success') => {
  snackbar.value ={
    visible: true,
    message,
    timeout: 3000,
    color: type ==='success' ? 'green' : type === 'error' ? 'red' : 'blue'
  };
}

export const snackbar = ref({
  visible: false,
  message: '',
  timeout: 3000,
  color: 'success'
});

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pending':
      return 'amber';

    case 'Inactive':
    case 'Out of Stock':
    case 'Cancelled':
      return 'red';

    case 'Received':
      return 'blue';


    case 'Shipped':
      return '';

    case 'Low Stock':
      return 'orange';

    case 'Delivered':
    case 'Active':
    case 'In Stock':
      return 'green';

    default:
      return 'grey';
  }
};


export const  BASE_URL = 'http://localhost:8000'
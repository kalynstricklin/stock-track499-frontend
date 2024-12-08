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

    case 'Out of Stock':
      return 'red';


    case 'Low Stock':
      return 'orange';

    case 'Received':
    case 'Shipped':
    case 'In Stock':
      return 'green';

    default:
      return 'grey';
  }
};


export const  BASE_URL = 'http://localhost:8000'
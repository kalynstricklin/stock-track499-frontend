import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'
import { supplierURL } from '@/server/services/SupplierHandler'

export const userURL: string = 'http://localhost:8000/users/';

export async function editUserRequest(user: any, firebase_id_token: string){
  const url = userURL + `&firebase_id_token=${firebase_id_token}`;

  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });

    if(!response.ok){
      return `Error updating user information: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error updating user information: ${error.message}`
  }
}



//method to fetch users from the database
export async function fetchUserRequest(firebase_id_token: string) {
  const url = userURL + '&firebase_id_token=${firebase_id_token}'

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok){
      return `Error fetching user: ${response.text()}`
    }

    const supplierList = await response.json()
    return supplierList;

  }catch(error: any){
    return `Error fetching user: ${error.message}`
  }
}



export async function deleteUserRequest(email: string, firebase_id_token: string) {

  const url = userURL + `${email}&firebase_id_token=${firebase_id_token}`;

  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok){
      return `Error deleting user: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting user: ${error.message}`
  }
}


//function to create a new user
export async function createUserRequest(user: any, firebase_id_token: string){

  const url = userURL + `?firebase_id_token=${firebase_id_token}`;


  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }


  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    });

    if(!response.ok){
      return `Error creating user: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating user: ${error.message}`
  }
}

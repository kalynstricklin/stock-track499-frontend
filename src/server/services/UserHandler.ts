import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'
import { supplierURL } from '@/server/services/SupplierHandler'

export const userURL: string = "http://localhost:8000";

export async function editUserRequest(user: any, uid: string, firebase_id_token: string){


  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }
  const url = `${userURL}/users/${uid}/`;


  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    });

    if(!response.ok){
      return `Error updating user information: ${response.text()}`
    }else{
      return 'Success'
    }

  }catch(error: any){
    return `Error updating user information: ${error.message}`
  }
}



//method to fetch users from the database
export async function fetchAllUsers(firebase_id_token: string) {
  const url = `${userURL}/users/`;

  try{
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebase_id_token}`
      },

    });

    if(!response.ok){
      return `Error fetching user: ${response.text()}`
    }

    const users = await response.json()
    return users;

  }catch(error: any){
    return `Error fetching user: ${error.message}`
  }
}

export async function fetchUserByUid(firebase_id_token: string) {
  const url = `${userURL}/users/`;

  try{
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebase_id_token}`
      },

    });

    if(!response.ok){
      return `Error fetching user with id: ${response.text()}`
    }

    const users = await response.json()
    return users;

  }catch(error: any){
    return `Error fetching user: ${error.message}`
  }
}


export async function deleteUserRequest(uid: string, firebase_id_token: string) {

  const url = `${userURL}/users/${uid}/`;

  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${firebase_id_token}`
      },
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

  const url = `${userURL}/users/`;

  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }


  try{
    console.log('about to fetch')
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebase_id_token}`
      },
      body: JSON.stringify(user)
    });

    console.log('Response status ', response.status);
    console.log('Response status', await response.json());

    if(!response.ok){

      return `Error creating user: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating user: ${error.message}`
  }
}

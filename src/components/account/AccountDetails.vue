<script setup lang="ts">

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import {
  createUserRequest,
  editUserRequest,
  fetchUserByUid
} from '@/server/services/UserHandler'
import { showSnackbar } from '@/utils/utils'


interface User {
  username: string;
  email: string;
  role: string;
  created: Date;
  profile_img: string;
}


const auth = getAuth();
const user = ref();

const userDetails = ref<User>({
  username: '',
  email: '',
  role: '',
  created: new Date(),
  profile_img: ''
});


const editProfileDialog = ref(false);

onAuthStateChanged(auth, async (currentUser) => {
  user.value = currentUser;

  if (currentUser) {


    try{
      const token = await currentUser.getIdToken();
      const userData = await fetchUserByUid(token);

      const specificUser = userData.find((u: any) => u.email === currentUser.email);

      if(specificUser){
        form.value.username = specificUser.username || '',
        form.value.email = specificUser.email || '';
        form.value.role = specificUser.role || '';

        userDetails.value.username = specificUser.username || '';
        userDetails.value.email = specificUser.email || '';
        userDetails.value.role = specificUser.role || '';
        userDetails.value.created = specificUser.created || new Date();
        userDetails.value.profile_img = specificUser.profile_img || '';

      }else{
        showSnackbar(`Failed to fetch user data: ${currentUser.email}`, 'error');
      }

    }catch(error: any){
      showSnackbar('Error fetching user data.', 'error')
    }
  }

});


async function signout() {
  try {
    await signOut(auth);
    user.value = null;
  } catch (error) {
    showSnackbar('Sign out failed. Please try again.', 'error');
  }
}

const profileImg = computed(() => userDetails.value.profile_img || 'mdi-account-circle');


const form = ref({
  username: '',
  email: '',
  role: ''
});

const resetForm = () => {
  form.value = {
    username: user.value?.username,
    email: user.value?.email || '',
    role: user.value?.role || '',
  };
};


const isLoading = ref(false);

async function saveChanges() {
  if (!auth.currentUser) {
    showSnackbar('No authenticated user found.', 'error');
    return;
  }

  isLoading.value = true;
  try {
    const token = await auth.currentUser.getIdToken();


    const updatedDetails = {
      username: form.value.username,
      email: userDetails.value.email,
      role: userDetails.value.role,
    }
    const response = await editUserRequest(updatedDetails, auth.currentUser.uid, token);


    console.log(`Response: ${response}`)
    if (response === 'Success') {
      showSnackbar('Profile updated successfully!', 'success');
      close();
    } else {
      showSnackbar(response, 'error');
    }
  } catch (error) {
    showSnackbar('An unexpected error occurred. Please try again.', 'error');
  }
}

function openDialog(){
  editProfileDialog.value = true;

}


function close() {
  editProfileDialog.value = false;

}


</script>


<template>
  <v-container id="account-details" fluid tag="section">
    <v-card class="pa-5">

      <v-row align="center" justify="center" class="text-center">
        <v-avatar size="100" color="info lighten-2" class="mt-2">
<!--          can do v-img for user.profile_img-->
          <v-icon icon="mdi-account-circle" size="100" class="grey darken2"></v-icon>
        </v-avatar>

        <v-col cols="12">
          <h3 class="text-h4 font-weight-bold">{{ form.username || 'Not specified' }}</h3>

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>{{ ( form.role).toUpperCase() || 'Not specified' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>{{ form.email || 'No email available' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Joined: {{ userDetails.created || 'Not specified' }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-row align="center" justify="center" class="text-center">
        <v-col cols="auto">
          <v-btn
            variant="tonal"
            color="blue lighten-3"
            class="mx-2"
            @click="openDialog"
          >
            Edit Profile
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            variant="tonal"
            color="error"
            class="mx-2"
            @click="signout"
          >
            Sign Out
          </v-btn>
        </v-col>
      </v-row>


      <!--     edit profile-->
        <v-dialog v-model="editProfileDialog">
          <v-card prepend-icon="mdi-account" title="Edit Profile">
            <v-card-text>
              <v-form>
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      v-model="form.username"
                      label="Username"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

                <v-btn
                  text="Close"
                  variant="plain"
                  @click="editProfileDialog=false"
                ></v-btn>

                <v-btn
                  variant="tonal"
                  color="primary"
                  @click="saveChanges"
                >Save Changes</v-btn>

            </v-card-actions>

          </v-card>

        </v-dialog>
    </v-card>
  </v-container>
</template>



<style scoped>


.text-none {
  text-transform: none;
}

.text-center {
  text-align: center;
}
</style>

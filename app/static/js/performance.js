const PerformanceForm =
{
    template: `  
            <div>

<!-- Edit Modal -->
<div class="modal animated is-active fadeIn" v-show="modal">
    <div class="modal-background" @click="modal = !modal"></div>
    <div class="modal-content">

        <div class="box">

            <div v-if="edit.mssg" class="notification animated fadeIn">
            <p v-if="edit.mssg['success']">
                             [[ edit.mssg['success'] ]]
                </p>
                <p class="is-inderline has-text-semibold" v-if="edit.mssg['message']">[[ edit.mssg['message'] ]]
                </p>
            </div>
            <form id="data_entry" novalidate="true" @submit="saveEditData">
                <div v-if="edit.errors.length" class="notification animated fadeIn">ERROR</p>
                    <ul>
                        <li v-for="error in edit.errors" class="is-underline">[[ error.message ]]</li>
                    </ul>
                </div>
                <p class="is-size-5">Edit Performance</p>
                <br>
                <div class="field">
                    <label class="label">Performance</label>
                    <input class="input" ref="name" v-model="edit.name" type="text">
                </div>
                <br>
                <div class="field is-grouped">
                    <p class="control">
                        <a class="button is-black" @click="saveEditData"><span class="icon icon-btn icon-btn-in"><i
                                    data-feather="plus"></i></span>Save
                        </a>
                    </p>

                    <p class="control">
                        <a class="button" @click="modal = !modal"><span class="icon icon-btn icon-btn-in"><i
                                    data-feather="x"></i></span>Cancel
                        </a>
                    </p>
                </div>
            </form>

        </div>
        <button class="modal-close is-large" aria-label="close" @click="modal = !modal"></button>

    </div>

</div>

<!-- Entry Form -->

<form id="data_entry" novalidate="true" @submit="submitData ;" v-show="view">
<div v-if="form.mssg" class="notification animated fadeIn">
    <p v-if="form.mssg.success">[[ form.mssg['success'] ]]</p>
    <p v-if="form.mssg.message" class="is-underline">[[ form.mssg['message'] ]]</p>

</div>
    
<div v-if="form.errors.length" class="notification">
        <p class="has-text-weight-semibold"> ERROR</p>
        <ul>
            <li v-for="error in form.errors " class="is-underline">[[ error ]]</li>
        </ul>
    </div>

    <div class="field">
        <div class="control">
            <label for="" class="label">Performance</label>
            <input type="text" class="input"ref="name" v-model="form.name" placeholder="Enter Performance">
        </div>

    </div>
    <div class="field is-grouped">
        <div class="control">
            <button type="submit" @click="submitData" class="button is-black"><span
                    class="icon icon-btn icon-btn-in"><i data-feather="plus"></i></span> Add</button>
        </div>
        <div class="control">
            <button class="button" v-on:click="view = !view" @click="getData"><span
                    class="icon icon-btn icon-btn-in"><i data-feather="eye"></i></span> View</button>
        </div>
    </div>
</form>


<!-- Table  -->

<div v-show="!view">
<div class="control">
            <button class="button" v-on:click="view = !view ; form.errors = [] ; "><span
                    class="icon icon-btn icon-btn-in"><i data-feather="eye"></i></span> View</button>
        </div>
        <br>
    <div class="table-container" id="data_view">

        <table class="table is-bordered is-fullwidth">
            <thead>
                <tr>
                    <th v-on:click="sortTable()">Name</th>
                    <th>Action</th>
                </tr>

            </thead>
            <tbody>
                <tr v-for="( row ,index ) in data" v-bind:index="index" @click="selectRow(row)"
                    v:bind:class="selected : isSelected">
                    <td>[[ row.name]]</td>
                    <td>
                        <div class="buttons">
                            <div class="button" @click="editData(row)">Edit</div>
                            <div class="dropdown">
                                <div class="dropdown is-hoverable">
                                    <div class="dropdown-trigger">
                                        <button class="button is-danger" aria-haspopup="true"
                                            aria-controls="dropdown-menu4">
                                            <span>Delete</span>

                                        </button>
                                    </div>
                                    <div class="dropdown-menu" style="z-index:10;" id="dropdown-menu4" role="menu">
                                        <div class="dropdown-content has-background-light">
                                            <p class="dropdown-item is-size-6 is-underline">
                                                Are you sure ?
                                            </p>
                                            <hr class="dropdown-divider">

                                            <a class="dropdown-item">
                                                    <div class="button is-danger is-small"
                                                        @click="deleteData(row , index)">Delete</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</div>
    `,
    data() {
        return {
            view: true ,
            form: {
                errors: [],
                id : null,
                name: null,
                mssg: null
            },
            data: null,
            modal: false,
            edit: {
                errors: [],
                name: null,
                mssg: null
            },
            confirm: false,
            ascending: false,
            sortColumn: '',
        }
    },
    watch:{
        data : function(){
            feather.replace()
        }
    },
    delimiters: ["[[", "]]"], 
    mounted() {
        feather.replace();
        this.focusInput();
    },
    methods: {      
        focusInput(){
            this.$refs.name.focus();
        }  ,
        checkData(e) {
            if (this.form.name) {
                return true;
            }

            this.form.errors = []

            if (!this.form.name) {
                this.form.errors.push('Performance required');
            }
           

        },
        
        submitData(e) {
            this.checkData(e);
            var formdata = this ;

            if (this.form.errors.length == 0) {
                axios
                    .post('/master/add/performance', this.form)
                    .then(function (response) {
                        formdata.form.mssg = response['data']
                        formdata.form.name = null;
                        setTimeout( () => { formdata.form.mssg = null } , 3000);
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
            e.preventDefault();
            this.focusInput()
        },
        getData(e){
            const formdata = this ;

            axios
                    .get('/master/get/performance')
                    .then(function (response) {
                        console.log(response);
                        formdata.data = response['data']

                    })
                    .catch(function (error) {
                        console.log(error)
                    });
        
            e.preventDefault();
        },
        editData(data){
            this.edit.errors = []

            this.modal = true
            this.edit.name = data.name
            this.edit.id = data.id

        },
        saveEditData(e){
            const formdata = this;
            var data  = this.data;
            if (this.edit.name) {
                
                axios
                .post('/master/edit/performance' , this.edit)
                .then(function (response) {
                    console.log(response.data)
                    if(response.data.success){
                        data = data.filter( function(x){ return x.id === formdata.edit.id } )
                        data[0].name = formdata.edit.name
                        formdata.modal =     !formdata.modal;
                    }
                    else{
                        formdata.edit.errors.push(response.data)
                    }

                })
                .catch(function (error) {
                    console.log(error)
                })
            }


            this.edit.errors = []
            console.log(this.edit.name)

            if (this.edit.name == "") {
                this.edit.errors.push('Performance required');
                
            }
          
    e.preventDefault();
            
        },
        deleteData(data , index){
            // const removeId = data.id; 
            console.log(data);
            var datalist = this.data; 

            axios
                    .post('/master/delete/performance', data)
                    .then(function (response) {
                        if(response.data.success){
                            datalist.splice(index, 1)
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
        },
        selectRow(){

        },
    }
}

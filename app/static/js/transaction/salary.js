
new Vue({
    el: "#salary_sheet_form",
    data() {
        return {
            company: null,
            month: null,
            isGenerating: null,
            errors: {},
            salarySheet: null,
            selectedRow: []
        }
    },
    delimiters: ['[[', ']]'],
    computed: {
        salarySheetEdit() {
            if (this.salarySheet != null) {
                this.salarySheet.forEach(function (row) {
                    row.total_deductions = parseFloat(row.net_adv_deduction) + parseFloat(row.esi) + parseFloat(row.pf) + parseFloat(row.tds) + parseFloat(row.other_deduction) + parseFloat(0)
                    const tempPay = row.pay_1
                    row.net_payable = parseFloat(tempPay) - parseFloat(row.total_deductions)
                })
            }

            return this.salarySheet
        }
    },
    methods: {
        generateSalarySheet() {
            if (this.checkData()) {
                this.isGenerating = true
                let rawdata = this
                let formdata = { 'company': this.company, 'month': this.month }
                axios.post('/transaction/salary_sheet/generate', formdata)
                    .then(function (response) {
                        rawdata.salarySheet = response.data

                        rawdata.isGenerating = null;
                    })
                    .catch(function (error) {
                        rawdata.$buefy.snackbar.open({
                            duration: 4000,
                            message: 'Salary sheet could not be geenrated. Please check logs.',
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })

                        rawdata.isGenerating = null;

                    })
            }


        },
        formatedNumber(val) {
            let test = Number(val).toLocaleString('en-IN');
            return test
        },

        checkData() {
            this.errors = {}

            if (!this.company || !this.month) {
                this.$set(this.errors, 'req', true)
            }

            if (Object.keys(this.errors).length === 0) {
                return true
            }
            else {
                return false
            }
        },
        printAll() {
            let rawdata = this
            let formdata = { 'company': this.company, 'date': this.month, 'data': this.salarySheet }
            localStorage.setItem('jsondata', JSON.stringify(formdata))
            axios.post('/transaction/salary_sheet/print/all', formdata)
                .then(function (response) {
                    console.log(response)
                    const win = window.open('/transaction/salary_sheet/print/all', '_blank', [], true);
                })
        },
        pushRow(index) {
            console.log(index)
            let raw = this
            if (this.selectedRow.includes(index)) {
                this.selectedRow.filter(function (item) {
                    if (item == index) {
                        console.log(item, index, raw.selectedRow)
                        raw.selectedRow.splice((raw.selectedRow.indexOf(item)), 1)
                    }
                })

            }
            else {
                this.selectedRow.push(index);
            }
        },
        printSelected() {
            let rawdata = this
            let selectedData = []
            this.selectedRow.forEach(function (index) {
                selectedData.push(rawdata.salarySheet[rawdata.selectedRow.indexOf(index)])
            })
            let formdata = { 'company': this.company, 'date': this.month, 'data': selectedData }
            localStorage.setItem('selecteddata', JSON.stringify(formdata))
            axios.post('/transaction/salary_sheet/print/selected', formdata)
            .then(function (response) {
                console.log(response)
                const win = window.open('/transaction/salary_sheet/print/selected', '_blank', [], true);
            })
        },
        processSalary() {
            let rawdata = this
            let formdata = { 'company': this.company, 'date': this.month, 'data': this.salarySheet }
            axios.post('/transaction/salary_sheet/process', formdata)
                .then(function (response) {
                    if (response.data.success) {
                        rawdata.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.success,
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                    else if (response.data.message) {
                        rawdata.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.message,
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                })
        }
    }

})

Vue.component('vue-feather', VueFeather);

let app = new Vue({
    el: '#app',
    data: {
        rawTransactionData: [],
        transactionData: [],
        isLoading: false,
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        getTransactionType(type) {
            let result = '';

            switch(type) {
                case 1:
                    result = 'Pay';
                    break;
                case 2:
                    result = 'Collect';
                    break;
                default:
                    result = '';
                    break;
            };

            return result;
        },
        getTransactionStatus(status) {
            let result = '';

            switch(status) {
                case 1:
                    result = 'Pending';
                    break;
                case 2:
                    result = 'Confirmed';
                    break;
                case 3:
                    result = 'Expired';
                    break;
                case 4:
                    result = 'Reject';
                    break;
                case 5:
                    result = 'Cancel';
                    break;
                default:
                    result = '';
                    break;
            }
            
            return result;
        },
        getTransactionDirection(direction) {
            let result = '';

            switch(direction) {
                case 1:
                    result = 'right';
                    break;
                case 2:
                    result = 'left';
                    break;
                default:
                    result = '';
                    break;
            };

            return result;
        },
        checkDateDifferent(date1, date2) {
            const d1 = new Date(date1);
            const d2 = new Date(date2);

            return !(d1.getDate() === d2.getDate()
            && d1.getMonth() === d2.getMonth()
            && d1.getYear() === d2.getYear());
        },
        async fetchData() {
            this.isLoading = true;
            let url = new URL('https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory');
            const params = { userId: 1, recipientId: 2 };
            url.search = new URLSearchParams(params).toString();
            fetch(url)
                .then(response => response.json())
                .then(data => { 
                    this.rawTransactionData = data.transactions;
                })
                .then(() => {
                    let newTransactionData = [];

                    for(let i = 0; i < this.rawTransactionData.length; i += 1) {
                        // for dates
                        if (i === 0 || this.checkDateDifferent(this.rawTransactionData[i - 1].startDate, this.rawTransactionData[i].startDate)) {
                            let formatedDate = new Date(this.rawTransactionData[i].startDate);
                            newTransactionData.push({
                                messageType: 'center',
                                date: formatedDate.toDateString(),
                                amount: 0,
                                description: '',
                                status: '',
                                transactionType: '',
                                transactionId: 0,
                            });
                        }

                        // transactions
                        let payload = {
                            messageType: this.getTransactionDirection(this.rawTransactionData[i].direction), // left, right, date
                            date: new Date(this.rawTransactionData[i].startDate),
                            amount: this.rawTransactionData[i].amount,
                            description: this.rawTransactionData[i].description,
                            status: this.getTransactionStatus(this.rawTransactionData[i].status), // Pending, Confirmed, Expired, Reject, Cancel
                            statusImage: './assets/' + this.getTransactionStatus(this.rawTransactionData[i].status) + '.svg',
                            transactionType: this.getTransactionType(this.rawTransactionData[i].type), // Pay, Collect
                            transactionId: this.rawTransactionData[i].id,
                        };

                        newTransactionData.push(payload);
                    }
                    
                    this.transactionData = newTransactionData;
                    this.isLoading = false;
                });
        },
    }
});

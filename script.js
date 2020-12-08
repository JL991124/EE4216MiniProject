var app = new Vue( {
    el: '#app',
    data: {
        CreateStatus: '',
        MyToken: '',
        MyTokenpw: '',        
        AddContent: '',
        AddColour: 'Grey',
        AddSize: '1',
        EditContent: '',
        EditColour: '',
        EditSize: '',
        EditId: '',
        isEdit: false,
        Notes: [],
    },

    created: async function(){
        if (localStorage.getItem("MyToken") !== null) {
            console.log("in");
            this.MyToken = localStorage.MyToken;
            this.MyTokenpw = localStorage.MyTokenpw;
            this.Uname = localStorage.uname;
            this.ViewNote();
        }        
    },


    methods: {
        CreateUser: async function() {
            if(document.getElementById("uname").value.length==0 
                || document.getElementById("pw").value.length==0) {
                    alert("Username or Password is Empty, Please try again");
                    return;
            }
            this.MyToken = '';
            await fetch('http://54.226.195.55:8080/api/NewUser', {
            method: 'POST',
            body: JSON.stringify({
                "username": document.getElementById("uname").value,
                "password": document.getElementById("pw").value
            }),
            headers: {}
            })
            .then(res => res.text())
            .then(data => this.CreateStatus = data)           
        },

        ViewNote: async function() {
            this.Notes = [];
            await fetch('http://54.226.195.55:8080/api/memo', {
                method: 'POST',
                body: JSON.stringify({
                    "token": this.MyToken,
                    "tokenpw": this.MyTokenpw
                }),
                headers: {}
            })            
            .then(async function(res) {
                let clone1 = res.clone();
                var x = 'thx'
                await clone1.text().then(data => x = data);
                if (x == "Not Authorized") {
                    localStorage.clear();
                    alert("Sticky Notes is open in another window. Please login again to use in this window.")
                    location.reload();
                }                    
                return res.json();
            })
            .then(data => this.Notes = data)
        },

        UserLogin: async function() {           
            if(document.getElementById("uname").value.length==0 
                || document.getElementById("pw").value.length==0) {
                    alert("Username or Password is Empty, Please try again");
                    return;
            }
            this.CreateStatus = '';            
            await fetch('http://54.226.195.55:8080/api/GetMyToken', {
                method: 'POST',
                body: JSON.stringify({
                    "username": document.getElementById("uname").value,
                    "password": document.getElementById("pw").value
                }),
                headers: {}
            })
            .then(res => res.text())
            .then(data => this.MyToken = data)           
            await new Promise(r => setTimeout(r,1000));
            if (this.MyToken.length==64) {              
                localStorage.MyToken = this.MyToken;            
                this.ViewNote(); 
            }                    
        },

        UserLogout: async function() {
            localStorage.clear();
            location.reload();
        },

        GetTokenpw: async function() {
            await fetch('http://54.226.195.55:8080/api/GetMyTokenpw', {
                method: 'POST',
                body: JSON.stringify({
                    "username": document.getElementById("uname").value,
                    "password": document.getElementById("pw").value
                }),
                headers: {}
            })
            .then(res => res.text())
            .then(data => this.MyTokenpw = data)
            localStorage.MyTokenpw = this.MyTokenpw;
        },      

        AddNote: async function() {
            if (this.AddContent == '') {
                alert("Empty Note Content");
                return;
            }            
            await fetch('http://54.226.195.55:8080/api/postMemo', {
                method: 'POST',
                body: JSON.stringify({
                    "token": this.MyToken,
                    "content" : this.AddContent,
                    "color": this.AddColour,
                    "font_size": this.AddSize
                }),
                headers: {}
            })
            .then(res => res.text())
            this.AddContent = '';
            this.ViewNote();
        },

        EditCol: function(code) {
            if (code == '0') {
                this.AddSize = '0';                
            }
            else if (code == '1') {
                this.AddSize = '1';
            }
            else if (code == '2') {
                this.AddSize = '2';
            }
            else {
                this.AddColour = code;
            }                        
        },       

        DeleteNote: async function(DelId) {
            if (this.isEdit && this.EditContent == '') {
                return;
            }            
            await fetch('http://54.226.195.55:8080/api/deleteMemo', {
                method: 'POST',
                body: JSON.stringify({
                    "id": DelId.toString(),
                    "token": this.MyToken,
                    "tokenpw": this.MyTokenpw
                }),
                headers: {}
        })
        .then(res => res.text())
        this.ViewNote();
        },        

        EditNote: async function(id, content, col, size) {
            if (this.isEdit) {
                alert("You haven't saved the previous note");
                return;
                this.EditContent = '';
            }
            this.isEdit = true;            
            this.EditId = id.toString();
            this.EditContent = content;
            this.EditColour = col;
            this.EditSize = size.toString();      
        },

        UpdateCol: function(code) {
            if (code == '0') {
                this.EditSize = '0';                
            }
            else if (code == '1') {
                this.EditSize = '1';
            }
            else if (code == '2') {
                this.EditSize = '2';
            }
            else {
                this.EditColour = code;
            }                        
        },

        UpdateNote: async function(UpdateId) {            
            this.isEdit = false;
            await fetch('http://54.226.195.55:8080/api/updateMemo', {
                method: 'POST',
                body: JSON.stringify({
                    "id": UpdateId.toString(),
                    "token": this.MyToken,
                    "tokenpw": this.MyTokenpw,
                    "content": this.EditContent,                    
                    "color": this.EditColour,
                    "font_size": this.EditSize
                }),
                headers: {}
            })
            .then(res => res.text())
            this.EditId = '';
            this.EditContent = '';
            this.EditColour = '';
            this.EditSize = '';
            this.ViewNote();
        }
    }
})

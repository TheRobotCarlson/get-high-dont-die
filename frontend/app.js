new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        drawer: null,
        interactionCounts: null,
        deadlyCounts: null,
        drugList: ["REMICADE", "VIOXX", "CARDIZEM"],
        queryUrl: "http://localhost:7474/db/data/transaction/commit",
        item: null,
        formattedRows: null,
        formattedRows2: null,
        formattedRows3: null,
        allDrugList: null
    }),
    methods: {
        getInteractions(){

            var insert = this.drugList.join("', '");
            var statement = "MATCH (d1:Drug)-[]->(interaction:Interaction)-[]->(reaction:Reaction) where d1.name in ['" + insert + "'] return d1.name, reaction.name, count(reaction) as val order by val DESC";
            var data = {
                "statements" : [ {
                  "statement" : statement
                } ]
              }

            fetch(this.queryUrl, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa("neo4j:pass")
                },
                body: JSON.stringify(data),
            })
            .then(stream => stream.json())
            .then(data => {this.interactionCounts = data["results"][0]["data"].slice(0, 7); this.formattedRows = this.interactionRows; console.log(this.interactionCounts)})
            .catch(error => console.error(error))
        },
        getDeadly(){

            var insert = this.drugList.join("', '");
            var statement = "MATCH (d1:Drug)-[]->(interaction:Interaction)<-[]-(d2:Drug) where d1.name > d2.name and d1.name in ['" + insert + "'] return d1.name, d2.name, size(collect((interaction)-[]->(:Reaction))) as val order by val DESC";
            var data = {
                "statements" : [ {
                  "statement" : statement
                } ]
              }

            fetch(this.queryUrl, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa("neo4j:pass")
                },
                body: JSON.stringify(data),
            })
            .then(stream => stream.json())
            .then(data => {this.deadlyCounts = data["results"][0]["data"].slice(0, 7); this.formattedRows2 = this.interactionRows2; console.log(this.interactionCounts)})
            .catch(error => console.error(error))
        },
        getDrugs(){

            var statement = "MATCH (d1:Drug) return d1.name";
            var data = {
                "statements" : [ {
                  "statement" : statement
                } ]
              }

            fetch(this.queryUrl, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa("neo4j:pass")
                },
                body: JSON.stringify(data),
            })
            .then(stream => stream.json())
            .then(data => {this.allDrugList = data["results"][0]["data"].slice(0, 30); this.formattedRows3 = this.formatDrugs; console.log(this.interactionCounts)})
            .catch(error => console.error(error))
        },
    },
    computed: {
        interactionRows(){
            var result = [];
            for (let i = 0; i < this.interactionCounts.length; i++) {
                const row = this.interactionCounts[i];
                var drug = row['row'][0];
                var reaction = row['row'][1];
                var count = row['row'][2];

                result.push({
                    "title": drug + " => " + reaction,
                    "drug": drug,
                    "reaction": reaction,
                    "count": count
                })
            }
            return result;
        },
        interactionRows2(){
            var result = [];
            for (let i = 0; i < this.deadlyCounts.length; i++) {
                const row = this.deadlyCounts[i];
                var drug = row['row'][0];
                var drug2 = row['row'][1];
                var count = row['row'][2];

                result.push({
                    "title": drug2 + " + " + drug2,
                    "drug": drug,
                    "drug2": drug2,
                    "count": count
                })
            }
            return result;
        },
        formatDrugs(){
            var result = [];
            for (let i = 0; i < this.allDrugList.length; i++) {
                const row = this.allDrugList[i];
                var drug = row['row'][0];

                result.push(drug)
            }
            return result;
        },
        runDrugs: {
            get: function() {
                return this.drugList;
            },
            set: function(value){
                this.drugList = value;
                this.getInteractions()
                this.getDeadly()

            }
        }
    },
    mounted(){
        this.getInteractions()
        this.getDeadly()
        this.getDrugs()
    }
})
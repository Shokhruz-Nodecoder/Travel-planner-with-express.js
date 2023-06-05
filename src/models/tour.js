class Tour {
    constructor(id, destination, cost, startDate,duration,enddate){
        this.id = id;
        this.destination = destination;
        this.cost = cost;
        this.startDate = startDate;
        this.duration = duration;
        this.enddate = enddate;
        this.created = new Date()
    }
}

module.exports = Tour;
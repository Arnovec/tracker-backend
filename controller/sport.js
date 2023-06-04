const { getDistanceFromLatLon } = require('./geo');

function getPace(time, distance){
    if (distance != 0) {

       return Math.floor(time / distance);
    }

    return 0;
}

function getStatisticByPoints(points) {
    let distance = 0;
    let time = 0;
    let pace = 0;

    let kilometerWaiting = 0;
    let kilometerStartTime = 0;
    let kilometerNumber = 1;
    const pace_per_kilometers = [];

    let part = 0;

    for (let i = 1; i < points.length; i++) {
        if (part == points[i].part) {

            time += points[i].time - points[i - 1].time;
            const lastDistance = getDistanceFromLatLon(points[i - 1], points[i]);
            distance += lastDistance;
            kilometerWaiting += lastDistance;
            if (kilometerWaiting >= 1000) {
                pace_per_kilometers.push({
                    kilometer: kilometerNumber,
                    pace: getPace((time - kilometerStartTime), kilometerWaiting),
                })
                kilometerWaiting = 0;
                kilometerStartTime = time;
                kilometerNumber += 1;
            }


        } else {
            part = points[i].part;
        }
    }
    if (kilometerWaiting >= 60 || kilometerNumber == 1) {
        pace_per_kilometers.push({
            kilometer: kilometerNumber,
            pace: getPace((time - kilometerStartTime), kilometerWaiting),
        })
    }

    pace = getPace(time, distance);

    return {
        distance,
        time,
        pace,
        pace_per_kilometers,
        start_time: points[0].time,
    }
}


module.exports = {
    getStatisticByPoints
}
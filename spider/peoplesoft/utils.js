const parse_time = (time) => {
    let t = time.slice(0, -2);
    let type = time.slice(-2);
    let tmp = t.split(':');
    let hour = ~~tmp[0], min = ~~tmp[1];
    if (type == 'PM') {
        hour += 12;
    }
    return {hour, min}
}

const parse_date = (date) => {
    const tmp = date.split('/');
    return { year: ~~tmp[2], month: ~~tmp[1], day: ~~tmp[0] }
}

module.exports = { parse_time, parse_date }
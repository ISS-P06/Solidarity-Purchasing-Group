'use strict';

import dayjs from 'dayjs';

class VTC {
    #currentTime = null;
    #weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /**
     * Virtual Time Clock
     *
     * Used for debug and testing of time related fatures.
     *
     * @param {any} [time=dayjs()]
     */
    constructor(time = dayjs().add(1, 'hour')) {
        this.#currentTime = dayjs(time);
    }

    /**
     * Return current virtual time.
     *
     * @return {dayjs.Dayjs} Current virtual time as ISO8601 string.
     */
    time() {
        return this.#currentTime.toISOString();
    }

    /**
     * Return current day of week, based con current virtual time
     *
     * @return {string} Day of the week.
     */
    day() {
        const id = this.#currentTime.day();
        return this.#weekdays[id];
    }

    /**
     * Set a new virtual time.
     *
     * @param {any} time as ISO8601 string.
     * @return {dayjs.Dayjs} Current virtual time.
     */
    set(time) {
        this.#currentTime = dayjs(time).add(1, 'hour');
        return this.#currentTime;
    }
}

export default VTC;
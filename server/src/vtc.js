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
    if (process.env.NODE_ENV !== 'production') {
      this.#currentTime = time;
    }
  }

  /**
   * Return current virtual time.
   *
   * @return {dayjs.Dayjs} Current virtual time.
   */
  get() {
    return this.#currentTime;
  }

  /**
   * Set a new virtual time.
   *
   * @param {any} time
   * @return {dayjs.Dayjs} Current virtual time.
   */
  set(time) {
    this.#currentTime = dayjs(time);
    return this.#currentTime;
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
}

export default VTC;

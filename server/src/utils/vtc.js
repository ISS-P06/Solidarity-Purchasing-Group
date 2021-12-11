'use strict';

import dayjs from 'dayjs';

class VTC {
  static #currentTime = null;
  #weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /**
   * Virtual Time Clock
   *
   * Used for debug and testing of time related fatures.
   *
   * @param {any} [time=dayjs()]
   */
  constructor(time = dayjs().add(1, 'hour')) {
    VTC.#currentTime = dayjs(time);
  }

  /**
   * Return current virtual time.
   *
   * @return {dayjs.Dayjs} Current virtual time as ISO8601 string.
   */
  time() {
    return VTC.#currentTime.toISOString();
  }

  /**
   * Return current virtual time.
   *
   * @return {dayjs.Dayjs} Current virtual time with format `YYYY-MM-DD HH:MM`.
   */

  formatTime() {
    return VTC.#currentTime.format('YYYY-MM-DD HH:MM');
  }

  /**
   * Return current day of week, based con current virtual time
   *
   * @return {string} Day of the week.
   */
  day() {
    const id = VTC.#currentTime.day();
    return this.#weekdays[id];
  }

  /**
   * Set a new virtual time.
   *
   * @param {any} time as ISO8601 string.
   * @return {dayjs.Dayjs} Current virtual time.
   */
  set(time) {
    VTC.#currentTime = dayjs(time).add(1, 'hour');
    return VTC.#currentTime;
  }
}

export default VTC;

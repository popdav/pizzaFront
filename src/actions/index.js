import { SET_DATA } from "../constants/index"

export function setData(payload) {
    return { type: SET_DATA, payload }
}

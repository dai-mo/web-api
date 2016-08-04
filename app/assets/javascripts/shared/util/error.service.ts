/**
 * Created by cmathew on 14/07/16.
 */

export class ErrorService {
    handleError(error: any) {
        alert(JSON.stringify(error))
        return Promise.reject(error.message || error)
    }
}
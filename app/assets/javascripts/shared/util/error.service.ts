/**
 * Created by cmathew on 14/07/16.
 */

export class ErrorService {
    handleError(error: any) {
        console.error("An error occurred", error)
        return Promise.reject(error.message || error)
    }
}
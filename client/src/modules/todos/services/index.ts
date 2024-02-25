export class TodosService {
    async getTodos() {
        const res = await fetch('/api/v1/todo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.json();
    }

    async fetchRequest(data: object, method = "GET") {
        return fetch('/api/v1/todo', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
    }
}
const axios = require('axios');

class MixAPI {
    constructor(token, baseUrl = 'http://31.128.42.147:3333') {
        this.token = token;
        this.baseUrl = baseUrl;
        this.client = axios.create({
            baseURL: this.baseUrl
        });
    }

    async _makeRequest(endpoint, data) {
        try {
            const response = await this.client.post(endpoint, data);
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка запроса: ${error.message}`);
        }
    }

    /**
     * Получить баланс пользователя
     * @param {number} userId - ID пользователя
     * @returns {Promise<Object>} Информация о балансе
     */
    async getBalance(userId) {
        const data = { id: userId };
        return await this._makeRequest('/api/v1/balance', data);
    }

    /**
     * Перевести MIX другому пользователю
     * @param {number} toId - ID получателя
     * @param {number} amount - Количество MIX для перевода
     * @returns {Promise<Object>} Результат операции
     */
    async transfer(toId, amount) {
        const data = {
            token: this.token,
            id: toId,
            amount: amount
        };
        return await this._makeRequest('/api/v1/transfer', data);
    }

    /**
     * Получить историю транзакций
     * @param {number} type - Тип транзакций (1 - входящие, 2 - исходящие)
     * @returns {Promise<Object>} Список транзакций
     */
    async getTransactions(type = 1) {
        if (![1, 2].includes(type)) {
            throw new Error('type должен быть 1 или 2');
        }

        const data = {
            token: this.token,
            type: type
        };
        return await this._makeRequest('/api/v1/transactions', data);
    }
}

module.exports = MixAPI;

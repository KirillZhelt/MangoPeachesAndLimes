
class CoctailsAPI {

    static _API_URL = 'http://localhost:8000/api';

    static _DRINKS_ENDPOINT = '/drinks';
    static _INGREDIENTS_ENDPOINT = '/ingredients';
    static _RANDOM_DRINK_ENDPOINT = '/feeling-lucky';

    async _loadItems(itemsEndpoint, limit, offset, filters, searchQuery) {
        let urlString = `${CoctailsAPI._API_URL}${itemsEndpoint}/?format=json`;
        if (limit !== undefined) {
            urlString += `&limit=${limit}`;
        }
        if (offset !== undefined) {
            urlString += `&offset=${offset}`;
        }
        if (filters !== undefined) {
            for (const filter in filters) {
                urlString += `&${filter}=${filters[filter]}`;
            }
        }
        if (searchQuery !== undefined) {
            urlString += `&search=${searchQuery}`;
        }

        console.log(urlString);

        const url = new URL(urlString);

        const response = await fetch(url);
        const { results } = await response.json();
        
        return results;
    }

    async loadDrinks(limit, offset, searchQuery, ingredientIds, showAlcoholic, showNonAlcoholic) {
        const filters = {}

        if (ingredientIds !== undefined) {
            filters.ingredients = ingredientIds.join(',');
        }

        if (!(showAlcoholic && showNonAlcoholic)) {
            if (showAlcoholic) {
                filters.alcoholic = 'True';
            } else if (showNonAlcoholic) {
                filters.alcoholic = 'False';
            }
        }

        return this._loadItems(CoctailsAPI._DRINKS_ENDPOINT, limit, offset, filters, searchQuery);
    }

    async loadDrinksWithIngredients(ingredientIds, limit, offset) {
        const filters = {
            'ingredients': ingredientIds.join(','),
        };

        return this._loadItems(CoctailsAPI._DRINKS_ENDPOINT, limit, offset, filters);
    }

    async loadIngredients(limit, offset, searchQuery) {
        return this._loadItems(CoctailsAPI._INGREDIENTS_ENDPOINT, limit, offset, undefined, searchQuery);
    }

    async _loadItem(itemEndpoint, itemId) {
        let urlString = `${CoctailsAPI._API_URL}${itemEndpoint}/`;

        if (itemId) {
            urlString += `${itemId}/`;
        }

        urlString += '?format=json';

        const url = new URL(urlString);

        const response = await fetch(url);
        if (response.status === 404) {
            return null;
        }

        const result = await response.json();
        return result;
    }

    async loadDrink(drinkId) {
        return this._loadItem(CoctailsAPI._DRINKS_ENDPOINT, drinkId);
    }

    async loadIngredient(ingredientId) {
        return this._loadItem(CoctailsAPI._INGREDIENTS_ENDPOINT, ingredientId);
    }

    async loadSimilarDrinks(similarToId, n) {
        if (n === undefined) {
            n = 20;
        }

        const urlString = `${CoctailsAPI._API_URL}${CoctailsAPI._DRINKS_ENDPOINT}/${similarToId}/similar/?format=json&n=${n}`;
        const url = new URL(urlString);

        const response = await fetch(url);
        if (response.status === 404) {
            return null;
        }

        const result = await response.json();
        return result;
    }

    async loadRandomDrink() {
        return this._loadItem(CoctailsAPI._RANDOM_DRINK_ENDPOINT);
    }

}

const coctailsAPI = new CoctailsAPI();
export default coctailsAPI;

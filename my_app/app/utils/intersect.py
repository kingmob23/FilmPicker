from typing import List, Dict, Tuple

def get_watchlist_intersection(watchlists: Dict[str, List[Tuple[str, int]]]) -> List[Tuple[str, int]]:
    """
    Возвращает список фильмов, которые есть во всех watchlist'ах пользователей.
    
    :param watchlists: Словарь, где ключи - имена пользователей, значения - списки фильмов (название, год)
    :return: Список пересечений фильмов (название, год)
    """
    if not watchlists:
        return []

    # Получаем множества фильмов для каждого пользователя
    sets_of_films = [set(watchlist) for watchlist in watchlists.values()]

    # Находим пересечение всех множеств
    common_films = set.intersection(*sets_of_films)

    return list(common_films)

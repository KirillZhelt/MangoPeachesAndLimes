import redis

from django.conf import settings


class Storage:

    __redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

    @classmethod
    def save_similaritites(cls, key, pickled_similaritites):
        cls.__redis_client.delete(key)
        cls.__redis_client.rpush(key, *pickled_similaritites)

    @classmethod
    def save_storage(cls):
        cls.__redis_client.save()

    @classmethod
    def get_similaritites(cls, key, n):
        return cls.__redis_client.lrange(key, 0, n - 1)

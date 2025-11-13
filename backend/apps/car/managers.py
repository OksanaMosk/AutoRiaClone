# from django.db import models
#
#
# class carQuerySet(models.QuerySet):
#     def less_than_size(self,size):
#         return self.filter(size__lte=size)
#
#     def only_Margherita(self):
#         return self.filter(name__startswith='Margherita')
#
# class carManager(models.Manager):
#     def get_queryset(self):
#         return carQuerySet(self.model)
#
#     def less_than_size(self,size):
#         return self.get_queryset().less_than_size(size)
#     def only_Margherita(self):
#         return self.get_queryset().only_Margherita()

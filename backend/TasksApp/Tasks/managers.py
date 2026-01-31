from django.db import models
from .querysets import SoftDeleteQuerySet


class SoftDeleteManager(models.Manager):
    """
    Manager que por defecto excluye registros eliminados (soft-deleted).
    Usa SoftDeleteQuerySet para aplicar soft-delete.
    """

    def get_queryset(self):
        """Retorna un QuerySet que excluye registros donde deleted_at no es nulo."""
        return SoftDeleteQuerySet(self.model, using=self._db).filter(deleted_at__isnull=True)

    def with_deleted(self):
        """Incluye registros eliminados en el resultado."""
        return SoftDeleteQuerySet(self.model, using=self._db)


class AllObjectsManager(models.Manager):
    """
    Manager que incluye todos los registros (eliminados y no eliminados).
    Proporciona acceso completo sin filtros de soft-delete.
    """

    def get_queryset(self):
        """Retorna un QuerySet con todos los registros incluyendo los soft-deleted."""
        return SoftDeleteQuerySet(self.model, using=self._db)

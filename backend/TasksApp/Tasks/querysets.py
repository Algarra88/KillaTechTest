from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    """
    QuerySet personalizado para soportar soft-delete.
    Filtra automáticamente registros eliminados en queries normales.
    """

    def delete(self):
        """Soft-delete: marca los registros como eliminados sin borrarlos físicamente."""
        return self.update(deleted_at=timezone.now())

    def hard_delete(self):
        """Hard-delete: borra los registros de forma permanente de la base de datos."""
        return super().delete()

    def restore(self):
        """Restaura registros eliminados (soft-deleted) configurando deleted_at a None."""
        return self.update(deleted_at=None)

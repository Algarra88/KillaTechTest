from Tasks.models import TaskModel
from Tasks.serializers import TaskSerializer
from rest_framework import generics

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = TaskModel.objects.all().order_by('created_at', 'id')
    serializer_class = TaskSerializer

class TaskRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskModel.objects.with_deleted().all()
    serializer_class = TaskSerializer

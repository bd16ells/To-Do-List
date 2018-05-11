package com.example.demo;

import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.OptionalInt;

@Service
@AllArgsConstructor
public class TaskServiceImpl implements TaskService {

    private TaskRepository taskRepository;

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task update(Long id, Task incoming) {
        Optional<Task> current = taskRepository.findById(id);
        if(current.isPresent()) {

            BeanUtils.copyProperties(incoming, current.get(), "id", "completed");
            return save(current.get());
        }
        return null;
    }

    @Override
    public void delete(Task task) {
        taskRepository.delete(task);
    }

    @Override
    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public Iterable<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task toggleComplete(Task task){
        //taskRepository.delete(task);
        Task newTask = new Task();
        newTask.setCompleted(task.isCompleted());
        newTask.toggleCompleteness();
        BeanUtils.copyProperties(newTask, task, "id", "description");
        return taskRepository.save(task);

    }
}

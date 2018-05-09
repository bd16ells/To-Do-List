package com.example.demo;

public interface TaskService {

    Task save(Task task);

    Task update(Long id, Task incoming);

    void delete(Task task);

    void deleteById(Long id);

    Iterable<Task> findAll();
}

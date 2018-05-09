package com.example.demo;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@AllArgsConstructor
public class TaskController {
    TaskServiceImpl taskService;


    @GetMapping("/tasks")
    public Iterable<Task> findAll(){
        return taskService.findAll();
    }

    @PostMapping("/createTask")
    public Task createTask(@RequestBody Task task){
        return taskService.save(task);

    }
    @PutMapping("/updateTask/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Optional<Task> current,
                           @RequestBody Task incoming){

        if(current.isPresent()){
            return new ResponseEntity<Task>(taskService.update(current.get().getId(), incoming), HttpStatus.OK);

        }
        else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/completeTask/{id}")
    public ResponseEntity completeTask(@PathVariable("id") Optional<Task> task){
        if(task.isPresent()){

            return new ResponseEntity<Task>(taskService.toggleComplete(task.get()), HttpStatus.OK);
        }
        else return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity deleteTask(@PathVariable("id") Optional<Task> task){
        if(task.isPresent()){
            taskService.delete(task.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else return new ResponseEntity(HttpStatus.NOT_FOUND);

    }
}





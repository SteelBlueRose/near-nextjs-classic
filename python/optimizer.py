import sys
import json
from pulp import LpMaximize, LpProblem, LpVariable, lpSum, value

def main(tasks):
    tasks = json.loads(tasks)
    problem = LpProblem("Task_Scheduling", LpMaximize)

    x = {task["id"]: LpVariable(f"x_{task['id']}", cat="Binary") for task in tasks}
    completion_time = {task["id"]: LpVariable(f"C_{task['id']}", lowBound=0) for task in tasks}

    problem += lpSum(x[task["id"]] * task["reward"] - (completion_time[task["id"]] - task["deadline"]) * task["priority"] for task in tasks)

    for task in tasks:
        problem += completion_time[task['id']] >= task["estimated_time"]
        problem += completion_time[task['id']] <= task["deadline"]

    problem.solve()

    results = []
    for task in tasks:
        results.append({
            "id": task["id"],
            "priority": task["priority"],
            "reward": task["reward"],
            "complete": value(x[task["id"]]),
            "completion_time": value(completion_time[task["id"]])
        })
    
    sorted_tasks = sorted(results, key=lambda t: (t["priority"], t["completion_time"]))
    print(json.dumps(sorted_tasks))

if __name__ == "__main__":
    main(sys.argv[1])

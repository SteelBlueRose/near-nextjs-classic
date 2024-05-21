import sys
import json
from pulp import LpMaximize, LpProblem, LpVariable, lpSum

def main(tasks):
    tasks = json.loads(tasks)
    problem = LpProblem("Task_Scheduling", LpMaximize)

    x = {task["id"]: LpVariable(f"x_{task['id']}", cat="Binary") for task in tasks}
    completion_time = {task["id"]: LpVariable(f"C_{task['id']}", lowBound=0) for task in tasks}

    problem += lpSum(x[task["id"]] * task["reward"] - (completion_time[task["id"]] - task["deadline"]) * task["priority"] for task in tasks)

    for task in tasks:
        problem += completion_time[task['id']] >= task['time']
        problem += completion_time[task['id']] <= task['deadline']

    problem.solve()

    results = {task['id']: {"complete": x[task['id']].value(), "completion_time": completion_time[task['id']].value()} for task in tasks}
    print(json.dumps(results))

if __name__ == "__main__":
    main(sys.argv[1])

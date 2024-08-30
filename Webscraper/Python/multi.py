import multiprocessing

def task(x):
    return x * x

if __name__ == "__main__":
    # Number of processes to use
    num_processes = multiprocessing.cpu_count()

    # Create a pool of processes
    pool = multiprocessing.Pool(processes=num_processes)

    # Define the inputs
    inputs = [1, 2, 3, 4, 5]

    # Map the inputs to the function across the pool of processes
    results = pool.map(task, inputs)

    # Close the pool to free resources
    pool.close()
    pool.join()

    # Print the results
    print("Results:", results)

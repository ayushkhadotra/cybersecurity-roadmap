import random

MIN = 1
MAX = 20

secret = random.randint(MIN, MAX)
tries = 0
guess = 0

print("I'm thinking of a no. between " + str(MIN) + " to " + str(MAX))

while guess != secret:

    text = input("Take a Guess: ")
    guess = int(text)
    tries = tries + 1

    # now comparison 
    if guess < MIN or guess > MAX:
        print(" Number is Out of Range. Please Try Again!")
    
    elif guess < secret:
        print("Your guess is too low. Try again!")

    elif guess > secret:
        print("Your guess is too high. Try again!")
    else:
        print("Well done! You Guessed it in " + str(tries) + " tries")  

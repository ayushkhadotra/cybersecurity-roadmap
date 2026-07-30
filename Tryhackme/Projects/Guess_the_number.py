import random

secret = random.randint(1,20)
tries = 0
guess =0

print("I'm thinking of a no. between 1 to 20")

text = input("Take a Guess: ")
guess = int(text)
tries = tries + 1

# now comparison part

if guess < 1 or guess > 20:
    print(" Number is Out of Range. Please Try Again!")
elif guess < secret:
    print("Your guess is too low. Try again!")
elif guess > secret:
    print("Your guess is too high. Try again!")
else:   
    print("Well done! You Guessed it in " + str(tries) + " tries")


from dotenv import find_dotenv, load_dotenv

x = find_dotenv()
print(x)
x = load_dotenv(x)
print(x)
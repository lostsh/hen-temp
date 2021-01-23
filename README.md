# node-time

## Site web
Affiche simplement les donées contenues dans le fichier `data.csv` avec un sympatique script `js`

## NodeMCU
Récupère les donées atmosphériques, et les envoie periodiquement sur github via une requette http

## Action
**Pour récuperer les donées, ici j'utilise directement github Actions, avec un tache qui reçoie les requettes par une requette HTTP**

Création d'un workflow github pour récuperer les requettes : 

- Créer un Token
- Créer un workflow, par exemple celui ci :
```yml
name: Manual workflow

# Controls when the action will run. Workflow runs when manually triggered using the UI
# or API.
on:
  workflow_dispatch:
    # Inputs the workflow accepts.
    inputs:
      name:
        # Friendly description to be shown in the UI instead of 'name'
        description: 'Person to greet'
        # Default value if no value is explicitly provided
        default: 'World'
        # Input has to be provided for the workflow to run
        required: true

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "greet"
  greet:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
    # Runs a single command using the runners shell
    - name: Send greeting
      run: echo "Hello ${{ github.event.inputs.name }}"
    
    - name: Print Hello 
      run: echo Hello world
```

- Envoyer une requette `HTTP` pour faire tourner la tache :
    - Remplacez:
        - le [token] par votre token personnel
        - `lostsh` -> votre nom d'utilisateur
        - `node-time` -> le nom de votre repos
        - `manual.yml` -> le nom du fichier yml de votre tache
```bash
curl \
-X POST \
-H "Accept: application/vnd.github.v3+json" \
-H "Authorization: token [token]" \
https://api.github.com/repos/lostsh/node-time/actions/workflows/manual.yml/dispatches \
-d '{"ref":"master", "inputs":{"name":"OMG IT WORKS"}}'
```

### Pour envoyer une requette
Pour envoyer une requette a la github Action qui se trouve chez github api, on peut utiliser le programme `main.c` qui se trouve dans le dossier `sendRequest`. Le fichier qui est signore `secret.h` contiend une seule ligne a savoir :

```c
#define TOKEN 40XXXXXXXXXX1c20dfbaaaXXXXXXXXXXhdd7XXXX
```

Pour le compiler : 
```bash
gcc main.c -o request
```
Pour envoyer une requette : 
```bash
# 22.5 is the temperature to send
./request 22.5
```
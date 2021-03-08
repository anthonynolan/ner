def create_windowed_dataset(input_dat, sequence_length, mode='train'):
    matrix = []
    for index in range(len(input_dat)):
        if index+sequence_length>len(input_dat):
            break
        if mode=='train':
            matrix.append(input_dat[index:index+sequence_length])
        else:
            matrix.append([(a, None) for a in input_dat[index:index+sequence_length]])
        index+=sequence_length
    return matrix

def get_penn_treebank_tags():
    with open('data/penn_treebank.txt') as f:
        content = f.readlines()

    tidy = {}
    for i in range(0, len(content)-1, 2):
        tidy[content[i].strip()] = content[i+1].strip()
    return tidy

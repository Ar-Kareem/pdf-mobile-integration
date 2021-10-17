
def encoded_string_to_bytes(encoded_string):
    '''
    Converts an encoded string (that is represented in a non-encoded string) to bytes.
    This is useful when attempting to convert a raw string that is read in the following format: '\x23\xa7' (s='\\x23\\xa7')
    And needs to be converted to bytes: b'\x23\xa7'
    '''
    return b''.join([int(encoded_string[i+2:i+4], 16).to_bytes(1, 'little') for i in range(0, len(encoded_string), 4)])

def bytes_to_encoded_string(bstr):
    '''
    The opposite of encoded_string_to_bytes
    '''
    return "".join('\\x%02x' % b for b in bstr)

if __name__ == '__main__':
    # Todo convert this to test cases
    a = b'\x23\xa7'
    b = '\\x23\\xa7'

    k = a
    k = bytes_to_encoded_string(k) # convert a to b
    print(k == b)
    k = encoded_string_to_bytes(k) # convert b to a
    print(k == a)

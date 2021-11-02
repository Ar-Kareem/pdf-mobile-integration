def deep_serialize(obj):
    if obj is None or isinstance(obj, (int, float, bool, str)):
        return obj
    elif isinstance(obj, (list, tuple)):
        return tuple(deep_serialize(o) for o in obj)
    elif isinstance(obj, dict):
        return {k: deep_serialize(v) for k, v in obj.items()}
    elif hasattr(obj, 'serialize'):
        return obj.serialize()
    else:
        raise ValueError("Don't know how to serialize object of type" + str(type(obj)))

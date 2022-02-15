# pylint: disable-all
## @package test_module
# A python module for testing doxygen's python source parser.
import os

## @brief A global function.
# @param arg1 A integer for input.
# @param arg2 An option boolean extra measure.
# @return A string representing the args passed.
def global_func(arg1: int, arg2: bool = None) -> str:
    return f"arg1 = {arg1}" + ("" if arg2 is None else f" arg2 = {arg2}")

## @brief A class meant for inheritence.
class BaseClass:
    ## @param some_var An untyped variable for the c'tor ChildClass.
    def __init__(self, some_var):
        self.public_x = some_var


## @brief A child class that inheritsc from the BaseClass
class ChildClass(BaseClass):

    ##
    # @param some_var An untyped variable for the c'tor
    # @param some_other_var Another untyped variable which is specific to the
    # ChildClass.
    def __init__(self, some_var, some_other_var):
        super().__init__(some_var)
        self.public_y = some_other_var

    ## Prints the Operating System's name to stdout.
    def print_os_name(self):
        if isinstance(self.public_x, (bool, int)):
            print(os.name)

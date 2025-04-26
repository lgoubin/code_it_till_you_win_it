# validators.py
import unittest

valid_directions = ['N', 'E', 'S', 'W']

class TestLevel2(unittest.TestCase):
    def test_return_type(self):
        direction = nextMove()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = nextMove()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")        

    

def run_tests():
    test_case = TestLevel2

    loader = unittest.TestLoader()
    test_names = loader.getTestCaseNames(test_case)

    result = unittest.TestResult()
    for name in test_names:
        test = test_case(name)
        test.run(result)
        if not result.wasSuccessful():
            break  # Stop on first failure

    failures = []
    for test_case, traceback in result.failures + result.errors:
        last_line = traceback.strip().split("\n")[-1]
        message = last_line.split(": ", 1)[-1]
        failures.append(f"{message}")

    return {
        "success": result.wasSuccessful(),
        "message": "✔ Tous les tests passés" if result.wasSuccessful() else "✘ Échec",
        "failures": failures
    }

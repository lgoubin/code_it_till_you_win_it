import unittest

valid_directions = ['N', 'E', 'S', 'W']

class TestLevel1(unittest.TestCase):
    def test_nextMove_returns(self):
        if nextMove() is None:
            self.fail("La fonction 'nextMove' ne retourne rien. Assurez-vous qu'elle retourne une valeur.")
    def test_return_type(self):
        direction = nextMove()
        self.assertIsInstance(direction, str, "Ta fonction doit retourner une chaîne de caractères.")

    def test_direction_validity(self):
        direction = nextMove()
        self.assertIn(direction, valid_directions, f"'{direction}' n’est pas une direction valide ({valid_directions}).")

    def test_direction_south(self):
        direction = nextMove()
        self.assertEqual(direction, 'S', "Le serpent devrait aller vers le sud.")
    
def run_tests():
    test_case = TestLevel1

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

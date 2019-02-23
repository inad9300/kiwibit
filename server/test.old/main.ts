import {test, random} from './utils'
import * as assert from 'assert'

test('getFoodById', '02003', res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body.nutrients))
})

test('getRdis', {age: 25, gender: 'M'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getFoods', {name: 'broccol'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getFoodGroups', undefined, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getNutrients', undefined, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getTopFoodsForNutrient', {nutrientId: '208'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

test('getTopFoodsForNutrient', {nutrientId: '303'}, res => {
    assert(res.status === 200)
    assert(Array.isArray(res.body))
})

const name = random.ascii()

test('registerUser', {
    name,
    email: name + '@example.org',
    pwd: '1234'
}, res => {
    assert(res.status === 200)
    assert(res.body.name === name)
})
.then(res => {
    const $token = res.body.id + ':1234'

    test('getUser', {$token}, res => {
        assert(res.status === 200)
        assert(res.body.id === 1)
    })
    
    test('getWeekMeals', {$token}, res => {
        assert(res.status === 200)
        assert(Array.isArray(res.body))
    })
})

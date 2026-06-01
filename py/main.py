import asyncio

async def funt():
    await asyncio.sleep(1)
    print(__name__)

def fun1(num: int, name: str):
    print('start ' + str(num))
    print(num)
    if num == 1 or num == 7:
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
    print(name)
    print('done ' + str(num))

async def fun2(num: int, name: str):
    print('start ' + str(num))
    print(num)
    if num == 1 or num == 7:
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        print(num-10)
        # await asyncio.sleep(1)
        await funt()
        print(num-10)
    print(name)
    print('done ' + str(num))

async def r():
    # t1 = asyncio.to_thread(fun1, 1, 'nam')
    # t2 = asyncio.to_thread(fun1, 2, 'nam2')
    # t3 = asyncio.to_thread(fun1, 3, 'nam3')
    # t4 = asyncio.to_thread(fun1, 4, 'nam4')

    r1 = asyncio.create_task(fun2(1, 'name1'))
    r2 = asyncio.create_task(fun2(3, 'name3'))
    r3 = asyncio.create_task(fun2(5, 'name5'))
    r4 = asyncio.create_task(fun2(7, 'name7'))

    await r1
    await r2
    await r3
    await r4

    # await t1
    # await t2
    # await t3
    # await t4
    print('then ----- gather')
    # t5 = asyncio.to_thread(fun1, 1, 'nam')
    # t6 = asyncio.to_thread(fun1, 2, 'nam2')
    # t7 = asyncio.to_thread(fun1, 3, 'nam3')
    # t8 = asyncio.to_thread(fun1, 4, 'nam4')
    await asyncio.gather(
        fun2(1, 'name1'),
        fun2(3, 'name3'),
        fun2(5, 'name5'),
        fun2(7, 'name7'),
    )
    # await t1
    # await t2
    # await t3
    # await t4

if __name__ == "__main__":
    asyncio.run(r())
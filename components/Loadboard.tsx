import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    CircularProgress
} from "@nextui-org/react";
import { PlusIcon } from "./loadboard/PlusIcon";
import { VerticalDotsIcon } from "./loadboard/VerticalDotsIcon";
import { ChevronDownIcon } from "./loadboard/ChevronDownIcon";
import { SearchIcon } from "./loadboard/SearchIcon";
import { columns, statusOptions } from "./loadboard/data";
import { capitalize } from "./loadboard/utils";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { Calendar } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/react";
import { users } from "./loadboard/data";
import DataService from "../services/service.js"
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import Details from './Details.js'

import CreateLoad from "./CreateLoad";
import axios from "axios";


const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

//these are the uuids of the columns.
const INITIAL_VISIBLE_COLUMNS = ["org_name", "rating", "progress", "origin", "destination", "weight", "pickup_date", "equipment_type", "price"];

//defines the user state of all the row data for the table
interface User {

    org_name: string,
    rating: string,
    progress: number,
    origin: string,
    destination: string,
    weight: number,
    pickup_date: string,
    equipment_type: string,
    price: number

}
export default function Loadboard() {


    const [users, setUsers] = React.useState([])

    const [loadID, setLoadID] = React.useState('')

    const [origin, setOrigin] = React.useState('')

    const [destination, setDestination] = React.useState('')

    const [weight, setWeight] = React.useState<number>(0)

    const [price, setPrice] = React.useState(0)

    const [equipment_type, setEquipment_type] = React.useState('')

    const [pickup_date, setPickup_date] = React.useState<string>('')

    const [loadInstance, setLoadInstance] = React.useState<string>('')

    const [toggleMap,setToggleMap] = React.useState(true) //when clicked change to true, when clicked again change to false

    const containerRef = React.useRef<any>(null)
    const iframe_ref = React.useRef<any>(null); //dont need this

    React.useEffect(() => {

        getLoads()

        //we use the loadID to refresh the table everytime a unique load is created. the table will be updated. this is not the real loaddi
    }, [loadID])

    React.useEffect(() => {

 async function testme(){
              const newElement = document.createElement('iframe');
              console.log('poop')

              const response =  axios.post(`http://localhost:5001/launchLoadInstanceMap`, { loadID: loadInstance });
              console.log('res')
              newElement.src = `http://localhost:5001/maps/${loadInstance}/demo.html`;
              newElement.width = '100%';
              newElement.height = '100%';
        
              if (containerRef.current) {
                containerRef.current.appendChild(newElement);
                // iframe_ref = containerRef; // Store a reference to the iframe element
              }              
        
          
            }
          
            testme();
        
        // return () => {
        //     if (containerRef.current && containerElement.current && containerRef.current.parentElement === containerRef.current) {
        //         containerRef.current.removeChild(containerElement.current);
        //       }
        //   };


    }, [loadInstance,toggleMap])
    
//     async function createMap(loadInstance){

//         const response= await axios.post(`http://localhost:5001/launchLoadInstanceMap`, { loadID: loadInstance });
//         const newElement = document.createElement('iframe')
//         newElement.src = `http://localhost:5001/maps/${loadInstance}/demo.html`;
//         newElement.width = '800';
//         newElement.height = '600';

// if(loadInstance){
//         containerRef.current.appendChild(newElement);
//             // containerElement.current = newElement; // Store a reference to the iframe element
// }
//     }

    function formatTheDate(value: any) {
        console.log(value)
        const dateVal = new Date(value?.year, value?.month - 1, value?.day); // Note: JavaScript months are 0-based, so we subtract 1 from the month

        const dateStr = format(dateVal, 'yyyy-MM-dd');
        setPickup_date(dateStr)
    }


    async function getLoads() {

        const { data } = await DataService?.getLoads() as any;
        setUsers(data)


    }



    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });



    async function insertLoad(origin: string, destination: string, weight: number, price: number, equipment_type: string, date: string) {

        //check if values entered

        if (origin && destination && weight && price && equipment_type && date) {
            //generate uuid to change load table state

            const uuid = uuidv4();
            setLoadID(uuid)

            //submit values
            const loadData = {
                origin: origin,
                destination: destination,
                weight: weight,
                price: price,
                equipment_type: equipment_type,
                pickup_date: date
            }
            DataService.createLoad(loadData)
            toast.success('Success! Load submitted')

        } else {
            toast.error('No inputs can be blank')
        }

    }





    const [page, setPage] = React.useState(1);

    const pages = Math.ceil(users.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user: User) => {
                console.log('lc', user)
                user.org_name?.toLowerCase().includes(filterValue.toLowerCase())
            }
            );
        }
        // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
        //   filteredUsers = filteredUsers.filter((user) =>
        //     Array.from(statusFilter).includes(user.status),
        //   );
        // }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] as number;
            const second = b[sortDescriptor.column as keyof User] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User] as number | string;

        switch (columnKey) {
            case "org_name":
                return (
                    <User
                        classNames={{
                            description: "text-default-500",
                        }}
                        description={user?.org_name}
                        name={cellValue}
                    >
                        {user?.org_name}
                    </User>
                );
            case "rating":
                return (
                    <div className="flex flex-col">
                        <CircularProgress
                            aria-label="Loading..."
                            size="lg"
                            value={cellValue as number}
                            color="warning"
                            showValueLabel={true}

                        />
                    </div>
                );
            case "progress":
                return (

                    <div className="flex flex-col">
                        <CircularProgress
                            aria-label="Loading..."
                            size="lg"
                            value={cellValue as number}
                            color="success"
                            showValueLabel={true}

                        />


                    </div>
                )
            
            default:
                return cellValue;

        }

    }, []);


    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="bg-foreground text-background"
                            endContent={<PlusIcon size={4} width={4} height={5} />}
                            size="sm"
                            onPress={onOpen}                        >
                            Add New
                        </Button>

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
            ],
        }),
        [],
    );

    console.log('threems', sortedItems)


    return (
        <>

            <div className=" w-full h-full  ">
                <Table
                    className="bg-transparent"
                    isCompact
                    removeWrapper
                    aria-label="Example table with custom cells, pagination and sorting"
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    checkboxesProps={{
                        classNames: {
                            wrapper: "after:bg-foreground after:text-background text-background",
                        },
                    }}
                    classNames={classNames}
                    selectedKeys={selectedKeys}
                    selectionMode="single"
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>

                    <TableBody emptyContent={"No users found"} items={sortedItems}>
                        {(item: any) => (
                            <TableRow key={item.id} onClick= {async(e)=>{setLoadInstance(item.id); onOpen2(); setToggleMap(toggleMap => !toggleMap);
                            }}>
                                {
                                    (columnKey) =>( <TableCell>{renderCell(item, columnKey)}</TableCell> )


                                }
                                
                            </TableRow>
                            

)}


                    </TableBody>


                </Table>
                <Modal className=" w-[100%] h-[95%] absolute   " //max-w-full will make the modal full page
                    isOpen={isOpen}
                    placement={'center'}
                    onOpenChange={onOpenChange}
                    backdrop={"blur"}
                >
                    <ModalContent >
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Create A Load</ModalHeader>
                                <ModalBody>
                                    <Input
                                        type="string"
                                        label="Origin"
                                        description="Pickup location"
                                        className="max-w-xs"
                                        labelPlacement="outside"
                                        placeholder=" "
                                        onChange={(e) => { setOrigin(e.target.value) }}
                                    />


                                    <Input
                                        type="string"
                                        label="Destination"
                                        description="Drop off location"
                                        className="max-w-xs"
                                        placeholder=" "
                                        labelPlacement="outside"
                                        onChange={(e) => { setDestination(e.target.value) }}


                                    />

                                    <Input
                                        type="number"

                                        label="Weight"
                                        description="Weight of Load"
                                        className="max-w-xs"
                                        placeholder=" "
                                        labelPlacement="outside"

                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">kg</span>
                                            </div>
                                        }
                                        onValueChange={setWeight as any}

                                    />

                                    <Input
                                        type="string"
                                        label="Equipment Type"
                                        description="Type of Vehicle Needed"
                                        className="max-w-xs"
                                        placeholder=" "
                                        labelPlacement="outside"
                                        onChange={(e) => { setEquipment_type(e.target.value) }}


                                    />
                                    <Input
                                        type="number"
                                        label="Price"
                                        placeholder="0.00"
                                        labelPlacement="outside"
                                        onValueChange={setPrice as any}

                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">$</span>
                                            </div>
                                        }
                                        endContent={
                                            <div className="flex items-center">
                                                <label className="sr-only" htmlFor="currency">
                                                    Currency
                                                </label>
                                                <select
                                                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                                                    id="currency"
                                                    name="currency"
                                                >
                                                    <option>USD</option>
                                                </select>
                                            </div>
                                        }
                                    />

                                    <div className="text-sm font-[400] mt-2">PickUp Date</div>
                                    <DatePicker label="Pickup Date" className="max-w-[284px]" onChange={(value: any) => {

                                        formatTheDate(value);

                                    }} />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onClick={(e) => { insertLoad(origin, destination, weight, price, equipment_type, pickup_date) }}>
                                        Action
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Button
                    className="bg-foreground text-background"
                    endContent={<PlusIcon size={4} width={4} height={5} />}
                    size="sm"
                    onPress={onOpen2}                        >
                    Details
                </Button>



                <Modal classNames={{
                    wrapper: "flex flex-end ml-[30%]   overflow-hidden                    ",
                    base: "max-w-[50%] h-full rounded-none",
                }} //max-w-full will make the modal full page
                    isOpen={isOpen2}
                    placement={'auto'}
                    onOpenChange={onOpenChange2}
                    backdrop={"opaque"}
                    isDismissable={true}
                    shouldBlockScroll={true}
                >
                    <ModalContent  >
                        {(onClose2) => (
                            <>
                                {/* <ModalHeader className="flex flex-col gap-1">View Load Details</ModalHeader> */}
                                <ModalBody>
<div className="h-[40%] w-[100%]  max-w-full" ref={containerRef}>


<Details id={loadInstance} ></Details>


</div>

                                    <div className="text-sm font-[400] mt-2">PickUp Date</div>

                                    <DatePicker label="Pickup Date" className="max-w-[284px]" />
                                    {loadInstance}

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose2}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={onClose2}>
                                        Action
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
